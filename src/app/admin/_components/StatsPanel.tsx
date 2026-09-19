"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatKRWAmount, startOfToday, startOfWeek } from "../_data/mock";
import { useAdmin } from "../_context/AdminContext";
import { rowMatchesRoomFilter } from "@/lib/rooms";
import {
  LIGHTING_OPTIONS,
  PARTY_OPTIONS,
  PILLOW_OPTIONS,
  SCENT_OPTIONS,
} from "@/lib/preferenceOptions";
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

      {!loading && (
        <>
          <StayMetrics period={period} />
        </>
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

function StayMetrics({ period }: { period: Period }) {
  const { selectedRoomId, rooms } = useAdmin();
  const [stays, setStays] = useState<
    { id: string; room_id: string | null; party_type: string | null; status: string; check_in: string | null }[]
  >([]);
  const [orders, setOrders] = useState<{ stay_id: string | null; total: number | string | null }[]>(
    [],
  );
  const [prefs, setPrefs] = useState<
    { stay_id: string | null; scent: string | null; pillow_firmness: string | null; lighting: string | null }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [stayRes, orderRes, prefRes] = await Promise.all([
        supabase.from("stays").select("id, room_id, party_type, status, check_in"),
        supabase.from("orders").select("stay_id, total"),
        supabase
          .from("preferences")
          .select("stay_id, scent, pillow_firmness, lighting"),
      ]);
      if (cancelled) return;
      setStays((stayRes.data ?? []) as typeof stays);
      setOrders((orderRes.data ?? []) as typeof orders);
      setPrefs((prefRes.data ?? []) as typeof prefs);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStays = stays.filter((stay) => {
    const inRoom = rowMatchesRoomFilter({
      room_id: stay.room_id,
      selectedRoomId,
      rooms,
    });
    const inTime = stay.check_in ? inPeriod(stay.check_in, period) : period === "all";
    return inRoom && inTime;
  });

  const completed = filteredStays.filter((stay) => stay.status === "completed");
  const stayIds = new Set(filteredStays.map((stay) => stay.id));
  const revenue = orders
    .filter((order) => order.stay_id && stayIds.has(order.stay_id))
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const avg = completed.length > 0 ? Math.round(revenue / completed.length) : 0;
  const orderedStayIds = new Set(
    orders.filter((order) => order.stay_id && stayIds.has(order.stay_id)).map((order) => order.stay_id),
  );
  const conversion =
    filteredStays.length > 0
      ? Math.round((orderedStayIds.size / filteredStays.length) * 100)
      : 0;

  const partyCounts = PARTY_OPTIONS.map((option) => ({
    ...option,
    count: filteredStays.filter((stay) => stay.party_type === option.id).length,
  }));
  const partyTotal = partyCounts.reduce((sum, row) => sum + row.count, 0);
  const partyGradient = partyCounts
    .filter((row) => row.count > 0)
    .reduce<{ slices: string[]; cursor: number }>(
      (acc, row, index, list) => {
        const colors = ["#b8956a", "#1a1814", "#6b6560", "#d4c4a8", "#8a7a62"];
        const start = acc.cursor;
        const next = acc.cursor + (row.count / partyTotal) * 100;
        acc.slices.push(`${colors[index % colors.length]} ${start}% ${next}%`);
        acc.cursor = next;
        void list;
        return acc;
      },
      { slices: [], cursor: 0 },
    ).slices.join(", ");

  function dist(
    options: readonly { id: string; ko: string }[],
    key: "scent" | "pillow_firmness" | "lighting",
  ) {
    const related = prefs.filter((pref) => !pref.stay_id || stayIds.has(pref.stay_id));
    const total = related.filter((pref) => pref[key]).length;
    return options.map((option) => {
      const count = related.filter((pref) => pref[key] === option.id).length;
      return {
        ...option,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }

  if (filteredStays.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
        아직 등록된 투숙이 없습니다
      </p>
    );
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="투숙당 평균 매출" value={formatKRWAmount(avg)} />
        <SummaryCard
          label="주문 전환율"
          value={`${conversion}%`}
        />
        <SummaryCard
          label="투숙 수"
          value={filteredStays.length.toLocaleString("ko-KR")}
        />
      </section>
      <p className="text-[0.72rem] text-muted">
        손님 {filteredStays.length}팀 중 {orderedStayIds.size}팀이 미니바를 이용했습니다.
      </p>

      <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-serif text-xl">동행 유형별 분포</h2>
        {partyTotal === 0 ? (
          <p className="mt-4 text-sm text-muted">동행 유형이 아직 없습니다.</p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div
              className="h-28 w-28 shrink-0 rounded-full"
              style={{ background: `conic-gradient(${partyGradient})` }}
            />
            <ul className="space-y-1 text-sm">
              {partyCounts.map((row) => (
                <li key={row.id} className="flex justify-between gap-4">
                  <span>{row.ko}</span>
                  <span className="tabular-nums text-muted">
                    {partyTotal > 0 ? Math.round((row.count / partyTotal) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-serif text-xl">취향 분포</h2>
        {(
          [
            ["향", dist(SCENT_OPTIONS, "scent")],
            ["베개", dist(PILLOW_OPTIONS, "pillow_firmness")],
            ["조명", dist(LIGHTING_OPTIONS, "lighting")],
          ] as const
        ).map(([title, rows]) => (
          <div key={title} className="mt-4">
            <p className="text-[0.68rem] tracking-wide text-muted">{title}</p>
            <ul className="mt-2 space-y-2">
              {rows.map((row) => (
                <li key={row.id}>
                  <div className="mb-1 flex justify-between text-[0.72rem]">
                    <span>{row.ko}</span>
                    <span className="tabular-nums text-muted">{row.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
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
