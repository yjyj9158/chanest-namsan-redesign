"use client";

import { useMemo, useState } from "react";
import { Check, Eye } from "lucide-react";
import {
  formatKRWAmount,
  startOfToday,
  startOfWeek,
  type OrderStatus,
} from "../_data/mock";
import { useAdmin } from "../_context/AdminContext";
import { cn, formatTimeAgo } from "@/lib/utils";

type OrderView = "active" | "history";
type DateFilter = "today" | "week" | "all";

function StatusBadge({ status }: { status: OrderStatus }) {
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

export function OrdersPanel() {
  const { orders, setOrderStatus, loading } = useAdmin();
  const [view, setView] = useState<OrderView>("active");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status === "new" || o.status === "seen"),
    [orders]
  );

  const historyOrders = useMemo(() => {
    const done = orders.filter((o) => o.status === "done");
    if (dateFilter === "all") return done;
    const start =
      dateFilter === "today" ? startOfToday() : startOfWeek();
    return done.filter((o) => new Date(o.createdAt) >= start);
  }, [orders, dateFilter]);

  const historyStats = useMemo(() => {
    const count = historyOrders.length;
    const sum = historyOrders.reduce((s, o) => s + o.amount, 0);
    return { count, sum };
  }, [historyOrders]);

  const list = view === "active" ? activeOrders : historyOrders;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl">주문</h1>
        <p className="mt-1 text-sm text-muted">
          미니바·객실 요청 목록 (로컬 미리보기)
        </p>
      </header>

      <div className="flex gap-2">
        {(
          [
            { id: "active" as const, label: "진행 중" },
            { id: "history" as const, label: "이력" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-medium transition-colors",
              view === tab.id
                ? "bg-charcoal text-white"
                : "border border-line bg-white text-muted hover:border-gold/40"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "history" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "today" as const, label: "오늘" },
                { id: "week" as const, label: "이번 주" },
                { id: "all" as const, label: "전체" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDateFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.68rem] font-medium",
                  dateFilter === f.id
                    ? "bg-gold-soft text-gold-dark"
                    : "bg-cream text-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm">
            완료 {historyStats.count}건 · 합계{" "}
            <span className="font-serif text-lg">
              {formatKRWAmount(historyStats.sum)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading && list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            불러오는 중…
          </p>
        )}

        {!loading && list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            {view === "active" ? "진행 중 주문이 없습니다." : "이력이 없습니다."}
          </p>
        )}

        {list.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-line bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-2xl tracking-wide">
                  Room {order.room}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-charcoal">
                  {order.items}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
              <div>
                <div className="font-serif text-lg">{order.total}</div>
                <div className="text-xs text-muted-light">
                  {formatTimeAgo(order.createdAt)}
                </div>
              </div>

              {view === "active" && (
                <div className="flex flex-wrap justify-end gap-2">
                  {order.status === "new" && (
                    <button
                      type="button"
                      onClick={() => setOrderStatus(order.id, "seen")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3.5 py-2 text-xs font-medium transition-colors hover:border-gold/40"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      확인
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOrderStatus(order.id, "done")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-gold-dark"
                  >
                    <Check className="h-3.5 w-3.5" />
                    완료 처리
                  </button>
                </div>
              )}
              {view === "history" && (
                <span className="text-xs text-admin-ok">처리 완료</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
