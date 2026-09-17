"use client";

import { useAdmin } from "../_context/AdminContext";
import { cn } from "@/lib/utils";

export function SummaryBar() {
  const { todayOrderCount, pendingCount, lowStockCount } = useAdmin();

  return (
    <div className="flex gap-2">
      <div className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-xl border border-line bg-white px-2.5 py-2 sm:px-3">
        <span className="truncate text-[0.65rem] text-muted sm:text-xs">
          오늘 주문
        </span>
        <span className="font-serif text-lg tabular-nums sm:text-xl">
          {todayOrderCount}
        </span>
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-1 rounded-xl border px-2.5 py-2 sm:px-3",
          pendingCount > 0
            ? "border-admin-alert/30 bg-admin-alert-bg"
            : "border-line bg-white",
        )}
      >
        <span
          className={cn(
            "truncate text-[0.65rem] sm:text-xs",
            pendingCount > 0 ? "text-admin-alert" : "text-muted",
          )}
        >
          미처리
        </span>
        <span
          className={cn(
            "font-serif text-lg tabular-nums sm:text-xl",
            pendingCount > 0 && "text-admin-alert",
          )}
        >
          {pendingCount}
        </span>
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-1 rounded-xl border px-2.5 py-2 sm:px-3",
          lowStockCount > 0
            ? "border-admin-warn/30 bg-admin-warn-bg"
            : "border-line bg-white",
        )}
      >
        <span
          className={cn(
            "truncate text-[0.65rem] sm:text-xs",
            lowStockCount > 0 ? "text-admin-warn" : "text-muted",
          )}
        >
          재고 부족
        </span>
        <span
          className={cn(
            "font-serif text-lg tabular-nums sm:text-xl",
            lowStockCount > 0 && "text-admin-warn",
          )}
        >
          {lowStockCount}
        </span>
      </div>
    </div>
  );
}
