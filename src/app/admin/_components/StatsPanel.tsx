"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatKRWAmount, startOfToday, startOfWeek } from "../_data/mock";
import { useAdmin } from "../_context/AdminContext";
import { rowMatchesRoomFilter } from "@/lib/rooms";
import { cn } from "@/lib/utils";

type Period = "today" | "week" | "month" | "all";

type RawOrder = {
  id: string;
  total: number | string | null;
  items: unknown;
  created_at: string;
  status: string;
  room?: string | null;
  room_id?: string | null;
};

type LineItem = {
  name: string;
  qty: number;
  price: number;
};

const CATEGORIES = [
  "Snack",
  "Soft Drink",
  "Whisky",
  "Wine",
  "Soju",
  "Highball",
] as const;

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "week", label: "이번 주" },
  { id: "month", label: "이번 달" },
  { id: "all", label: "전체" },
];

function startOfMonth(): Date {
  const d = startOfToday();
  d.setDate(1);
  return d;
}

function parseItems(items: unknown): LineItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as { name?: unknown; qty?: unknown; price?: unknown };
      const name = typeof item.name === "string" ? item.name.trim() : "";
      if (!name) return null;
      return {
        name,
        qty: Number(item.qty) || 1,
        price: Number(item.price) || 0,
      };
    })
    .filter((row): row is LineItem => row !== null);
}

function inPeriod(iso: string, period: Period): boolean {
  const created = new Date(iso);
  if (Number.isNaN(created.getTime())) return false;
  if (period === "all") return true;
  const start =
    period === "today"
      ? startOfToday()
      : period === "week"
        ? startOfWeek()
        : startOfMonth();
  return created >= start;
}

function lastSevenDays(): Date[] {
  const today = startOfToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function StatsPanel() {
  const { selectedRoomId, rooms } = useAdmin();
  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [categoryByName, setCategoryByName] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [orderRes, invRes] = await Promise.all([
        supabase.from("orders").select("*").eq("status", "done"),
        supabase.from("inventory").select("name, category"),
      ]);

      if (cancelled) return;

      if (orderRes.error) {
        setError(orderRes.error.message);
        setOrders([]);
      } else {
        setError(null);
        setOrders((orderRes.data ?? []) as RawOrder[]);
      }

      const map: Record<string, string> = {};
      for (const row of invRes.data ?? []) {
        if (row.name) map[String(row.name)] = String(row.category ?? "");
      }
      setCategoryByName(map);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          inPeriod(order.created_at, period) &&
          rowMatchesRoomFilter({
            room: order.room,
            room_id: order.room_id,
            selectedRoomId,
            rooms,
          }),
      ),
    [orders, period, selectedRoomId, rooms],
  );

  const summary = useMemo(() => {
    const count = filtered.length;
    const revenue = filtered.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );
    return {
      count,
      revenue,
      average: count > 0 ? Math.round(revenue / count) : 0,
    };
  }, [filtered]);

  const topItems = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number }>();
    for (const order of filtered) {
      for (const item of parseItems(order.items)) {
        const current = map.get(item.name) ?? { qty: 0, revenue: 0 };
        current.qty += item.qty;
        current.revenue += item.price * item.qty;
        map.set(item.name, current);
      }
    }
    return [...map.entries()]
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
      .slice(0, 5);
  }, [filtered]);

  const categorySales = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const category of CATEGORIES) totals[category] = 0;

    for (const order of filtered) {
      for (const item of parseItems(order.items)) {
        const category = categoryByName[item.name];
        if (!category || !(category in totals)) continue;
        totals[category] += item.price * item.qty;
      }
    }

    const sum = Object.values(totals).reduce((a, b) => a + b, 0);
    return CATEGORIES.map((category) => ({
      category,
      revenue: totals[category],
      percent: sum > 0 ? Math.round((totals[category] / sum) * 100) : 0,
    }));
  }, [filtered, categoryByName]);

  const daily = useMemo(() => {
    const days = lastSevenDays();
    return days.map((date) => ({
      date,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      count: orders.filter((order) =>
        sameDay(new Date(order.created_at), date),
      ).length,
    }));
  }, [orders]);

  const maxItemQty = Math.max(...topItems.map((item) => item.qty), 1);
  const maxDaily = Math.max(...daily.map((day) => day.count), 1);
  const empty = !loading && !error && filtered.length === 0;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl">통계</h1>
        <p className="mt-1 text-sm text-muted">
          완료된 주문의 품목별·기간별 매출
        </p>
      </header>

      <div className="flex gap-1 rounded-full border border-line bg-white p-1">
        {PERIODS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPeriod(item.id)}
            className={cn(
              "flex-1 rounded-full px-2 py-2 text-center text-[0.68rem] font-medium transition-colors sm:text-xs",
              period === item.id
                ? "bg-charcoal text-white"
                : "text-muted hover:text-charcoal",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl border border-admin-alert/30 bg-admin-alert-bg px-4 py-3 text-sm text-admin-alert">
          {error}
        </p>
      )}

      {loading && (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
        </p>
      )}

      {empty && (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          아직 완료된 주문이 없습니다
        </p>
      )}

      {!loading && !empty && (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard label="총 매출" value={formatKRWAmount(summary.revenue)} />
            <SummaryCard
              label="총 주문 수"
              value={summary.count.toLocaleString("ko-KR")}
            />
            <SummaryCard
              label="평균 주문 금액"
              value={formatKRWAmount(summary.average)}
            />
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-serif text-xl">인기 품목 TOP 5</h2>
            {topItems.length === 0 ? (
              <p className="mt-4 text-sm text-muted">집계할 미니바 품목이 없습니다</p>
            ) : (
              <ol className="mt-4 space-y-3">
                {topItems.map((item, index) => (
                  <li key={item.name}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">
                        {index + 1}. {item.name}
                      </span>
                      <span className="shrink-0 text-[0.72rem] text-muted tabular-nums">
                        {item.qty}개 · {formatKRWAmount(item.revenue)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${(item.qty / maxItemQty) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-serif text-xl">카테고리별 매출</h2>
            <ul className="mt-4 space-y-3">
              {categorySales.map((row) => (
                <li key={row.category}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-[0.72rem] font-medium tracking-wider text-gold uppercase">
                      {row.category}
                    </span>
                    <span className="text-[0.72rem] text-muted tabular-nums">
                      {row.percent}% · {formatKRWAmount(row.revenue)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                    <div
                      className="h-full rounded-full bg-charcoal"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-serif text-xl">최근 7일 주문</h2>
            <div className="mt-5 grid grid-cols-7 items-end gap-2">
              {daily.map((day) => (
                <div key={day.label} className="flex min-w-0 flex-col items-center gap-2">
                  <span className="text-[0.62rem] text-muted tabular-nums">
                    {day.count}
                  </span>
                  <div className="flex h-28 w-full items-end justify-center">
                    <div
                      className="w-full max-w-7 rounded-t-md bg-gold"
                      style={{
                        height: `${Math.max(
                          day.count > 0 ? 8 : 2,
                          (day.count / maxDaily) * 100,
                        )}%`,
                        opacity: day.count > 0 ? 1 : 0.25,
                      }}
                    />
                  </div>
                  <span className="text-[0.62rem] text-muted">{day.label}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-line bg-white px-4 py-4 shadow-sm">
      <p className="text-[0.68rem] text-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl tabular-nums sm:text-3xl">{value}</p>
    </article>
  );
}
