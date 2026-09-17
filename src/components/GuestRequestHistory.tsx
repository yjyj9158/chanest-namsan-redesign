"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { hotelData } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { subscribeTableChanges } from "@/lib/realtime";
import { supabase } from "@/lib/supabase";
import { cn, formatTimeAgo } from "@/lib/utils";

type HistoryKind = "order" | "request";

type HistoryItem = {
  id: string;
  kind: HistoryKind;
  createdAt: string;
  summary: string;
  status: "new" | "seen" | "done";
  reply?: string | null;
};

type OrderRow = {
  id: string | number;
  room: string;
  items: unknown;
  total?: number | string | null;
  status: string;
  created_at: string;
};

type RequestRow = {
  id: string | number;
  room: string;
  message: string;
  type?: string;
  status: string;
  reply: string | null;
  created_at: string;
};

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
    summary: formatOrderItems(row.items),
    status,
  };
}

function mapRequest(row: RequestRow): HistoryItem {
  return {
    id: `request-${row.id}`,
    kind: "request",
    createdAt: row.created_at,
    summary: row.message || "객실 요청",
    status: row.status === "answered" ? "done" : "new",
    reply: row.reply,
  };
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
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [ordersRes, requestsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .eq("room", hotelData.room)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("requests")
          .select("*")
          .eq("room", hotelData.room)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      if (cancelled) return;
      const orders = (ordersRes.data ?? []).map((row) => mapOrder(row as OrderRow));
      const requests = (requestsRes.data ?? []).map((row) =>
        mapRequest(row as RequestRow),
      );
      setItems(
        [...orders, ...requests].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      setLoaded(true);
    }

    void load();

    const unsubOrders = subscribeTableChanges<OrderRow>(
      "guest-orders-history",
      "orders",
      ["INSERT", "UPDATE"],
      (event, row) => {
        if (row.room && row.room !== hotelData.room) return;
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
        if (row.room && row.room !== hotelData.room) return;
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
  }, []);

  const visible = useMemo(() => items.slice(0, 12), [items]);

  return (
    <section id="request-history" className="px-6 py-16">
      <SectionHeader
        eyebrow={t.historyEyebrow}
        title={t.historyTitle}
        className="mb-8"
      />

      {!loaded ? (
        <p className="rounded-2xl border border-dashed border-charcoal/10 bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
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
