"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { hotelData } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRoom } from "@/context/RoomContext";
import { subscribeTableChanges } from "@/lib/realtime";
import { supabase } from "@/lib/supabase";
import { cn, formatTimeAgo } from "@/lib/utils";

type HistoryKind = "order" | "request";

type HistoryItem = {
  id: string;
  kind: HistoryKind;
  createdAt: string;
  updatedAt: string;
  summary: string;
  status: "new" | "seen" | "done";
  reply?: string | null;
};

type OrderRow = {
  id: string | number;
  room: string;
  room_id?: string | null;
  items: unknown;
  total?: number | string | null;
  status: string;
  created_at: string;
  updated_at?: string | null;
};

type RequestRow = {
  id: string | number;
  room: string;
  room_id?: string | null;
  message: string;
  type?: string;
  status: string;
  reply: string | null;
  created_at: string;
  updated_at?: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

function isVisibleHistoryItem(item: HistoryItem, now = Date.now()) {
  if (now - new Date(item.createdAt).getTime() >= DAY_MS) return false;
  if (item.status === "done") {
    const updated = new Date(item.updatedAt).getTime();
    if (!Number.isNaN(updated) && now - updated >= HOUR_MS) return false;
  }
  return true;
}

function formatOrderItems(items: unknown): string {
  if (!items) return "객실 요청";
  if (typeof items === "string") return items;
  if (!Array.isArray(items)) return "객실 요청";
  const summary = items
    .map((raw) => {
      const item = raw as { name?: string; qty?: number } | string;
      if (typeof item === "string") return item;
      const name = item.name ?? "";
      const qty = item.qty ?? 1;
      return name ? `${name} ×${qty}` : "";
    })
    .filter(Boolean)
    .join(", ");
  return summary || "객실 요청";
}

function mapOrder(row: OrderRow): HistoryItem {
  const status =
    row.status === "seen" ? "seen" : row.status === "done" ? "done" : "new";
  return {
    id: `order-${row.id}`,
    kind: "order",
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    summary: formatOrderItems(row.items),
    status,
  };
}

function mapRequest(row: RequestRow): HistoryItem {
  return {
    id: `request-${row.id}`,
    kind: "request",
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    summary: row.message || "객실 요청",
    status: row.status === "answered" ? "done" : "new",
    reply: row.reply,
  };
}

function sortHistory(items: HistoryItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function historyMatchesRoom(
  row: { room?: string | null; room_id?: string | null },
  roomNumber: string,
  roomId: string | null,
) {
  if (row.room && String(row.room) === roomNumber) return true;
  if (roomId && row.room_id && row.room_id === roomId) return true;
  return false;
}

function StatusBadge({ status }: { status: HistoryItem["status"] }) {
  if (status === "new") {
    return (
      <span className="inline-flex items-center rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
        ● 신규
      </span>
    );
  }
  if (status === "seen") {
    return (
      <span className="inline-flex items-center rounded-full bg-admin-warn-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-warn">
        ● 확인함
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-admin-ok-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-ok">
      ✓ 완료
    </span>
  );
}

export function GuestRequestHistory() {
  const { t } = useLanguage();
  const { room } = useRoom();
  const roomNumber = room.roomNumber || hotelData.room;
  const roomId = room.id;
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setLoadError(null);

    function withTimeout<T>(promise: PromiseLike<T>, ms: number) {
      return new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
        Promise.resolve(promise).then(
          (value) => {
            window.clearTimeout(timer);
            resolve(value);
          },
          (err) => {
            window.clearTimeout(timer);
            reject(err);
          },
        );
      });
    }

    async function load() {
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const ordersQuery = roomId
          ? supabase
              .from("orders")
              .select("*")
              .or(`room.eq.${roomNumber},room_id.eq.${roomId}`)
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(20)
          : supabase
              .from("orders")
              .select("*")
              .eq("room", roomNumber)
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(20);
        const requestsQuery = roomId
          ? supabase
              .from("requests")
              .select("*")
              .or(`room.eq.${roomNumber},room_id.eq.${roomId}`)
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(20)
          : supabase
              .from("requests")
              .select("*")
              .eq("room", roomNumber)
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(20);

        const [ordersRes, requestsRes] = await withTimeout(
          Promise.all([ordersQuery, requestsQuery]),
          12000,
        );
        if (cancelled) return;

        if (ordersRes.error || requestsRes.error) {
          console.error("[history] load failed", {
            orders: ordersRes.error?.message,
            requests: requestsRes.error?.message,
            roomNumber,
            roomId,
          });
          const fallback = await withTimeout(
            Promise.all([
              supabase.from("orders").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(20),
              supabase.from("requests").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(20),
            ]),
            12000,
          );
          if (cancelled) return;
          const [fbOrders, fbRequests] = fallback;
          if (fbOrders.error && fbRequests.error) {
            setLoadError(fbOrders.error.message);
            setItems([]);
            return;
          }
          const orders = (fbOrders.data ?? [])
            .filter((row) => historyMatchesRoom(row as OrderRow, roomNumber, roomId))
            .map((row) => mapOrder(row as OrderRow));
          const requests = (fbRequests.data ?? [])
            .filter((row) => historyMatchesRoom(row as RequestRow, roomNumber, roomId))
            .map((row) => mapRequest(row as RequestRow));
          setItems(sortHistory([...orders, ...requests]));
          setLoadError(null);
          return;
        }

        const orders = (ordersRes.data ?? [])
          .filter((row) => historyMatchesRoom(row as OrderRow, roomNumber, roomId))
          .map((row) => mapOrder(row as OrderRow));
        const requests = (requestsRes.data ?? [])
          .filter((row) => historyMatchesRoom(row as RequestRow, roomNumber, roomId))
          .map((row) => mapRequest(row as RequestRow));
        setItems(sortHistory([...orders, ...requests]));
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("[history] load exception", err);
        setLoadError(err instanceof Error ? err.message : "load failed");
        setItems([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();

    const unsubOrders = subscribeTableChanges<OrderRow>(
      "guest-orders-history",
      "orders",
      ["INSERT", "UPDATE"],
      (event, row) => {
        if (!historyMatchesRoom(row, roomNumber, roomId)) return;
        const mapped = mapOrder(row);
        setItems((prev) => {
          const next = prev.filter((item) => item.id !== mapped.id);
          if (event === "INSERT" || event === "UPDATE") next.unshift(mapped);
          return next.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        });
      },
    );

    const unsubRequests = subscribeTableChanges<RequestRow>(
      "guest-requests-history",
      "requests",
      ["INSERT", "UPDATE"],
      (event, row) => {
        if (!historyMatchesRoom(row, roomNumber, roomId)) return;
        const mapped = mapRequest(row);
        setItems((prev) => {
          const next = prev.filter((item) => item.id !== mapped.id);
          if (event === "INSERT" || event === "UPDATE") next.unshift(mapped);
          return next.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        });
      },
    );

    return () => {
      cancelled = true;
      unsubOrders();
      unsubRequests();
    };
  }, [roomNumber, roomId]);

  const visible = useMemo(
    () => items.filter((item) => isVisibleHistoryItem(item)).slice(0, 12),
    [items],
  );

  return (
    <section id="request-history" className="px-6 py-16">
      <SectionHeader
        eyebrow={t.historyEyebrow}
        title={t.historyTitle}
        className="mb-8"
      />

      {!loaded ? (
        <p className="rounded-2xl border border-dashed border-charcoal/10 bg-white px-4 py-10 text-center text-sm text-muted">
          {t.historyLoading}
        </p>
      ) : loadError && visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-charcoal/10 bg-white px-4 py-10 text-center text-sm text-muted">
          {t.historyLoadError}
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-charcoal/10 bg-white px-4 py-10 text-center text-sm text-muted">
          {t.historyEmpty}
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-charcoal/6 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-charcoal">
                    {item.summary}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-muted-light">
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              {item.reply ? (
                <p
                  className={cn(
                    "mt-3 rounded-xl bg-cream px-3 py-2 text-sm leading-relaxed text-charcoal",
                  )}
                >
                  <span className="mr-2 text-[0.65rem] font-medium tracking-wider text-gold uppercase">
                    {t.historyReply}
                  </span>
                  {item.reply}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
