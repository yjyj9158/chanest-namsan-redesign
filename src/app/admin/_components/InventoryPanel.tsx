"use client";

import { Minus, Plus } from "lucide-react";
import { useAdmin } from "../_context/AdminContext";
import { cn } from "@/lib/utils";

const LOW_STOCK = 3;

export function InventoryPanel() {
  const { inventory, updateInventoryQty, loading, inventoryError } = useAdmin();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-serif text-3xl">재고</h1>
        <p className="mt-1 text-sm text-muted">
          미니바 재고 수량 조정 (로컬 미리보기 · 원본 카테고리 유지)
        </p>
      </header>

      {inventoryError && (
        <p className="rounded-xl border border-admin-alert/30 bg-admin-alert-bg px-4 py-3 text-sm text-admin-alert">
          {inventoryError}
        </p>
      )}

      {loading && inventory.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
        </p>
      )}

      <div className="space-y-3">
        {inventory.map((item) => {
          const available = item.qty > 0;
          const isLow = available && item.qty <= LOW_STOCK;
          const isSoldOut = !available;

          return (
            <article
              key={item.id}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-sm",
                isSoldOut
                  ? "border-admin-alert/40"
                  : isLow
                    ? "border-admin-alert/35"
                    : "border-line"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[0.65rem] font-medium tracking-widest text-gold uppercase">
                    {item.category}
                  </div>
                  <h2 className="mt-0.5 truncate font-serif text-xl">
                    {item.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {isSoldOut && (
                      <span className="inline-flex rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
                        ● 품절
                      </span>
                    )}
                    {isLow && (
                      <span className="inline-flex rounded-full bg-admin-alert-bg px-2.5 py-1 text-[0.68rem] font-medium text-admin-alert">
                        ● 재고 부족
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateInventoryQty(item.id, -1)}
                    disabled={item.qty === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors enabled:hover:border-gold enabled:hover:text-gold-dark disabled:opacity-30"
                    aria-label={`${item.name} 수량 감소`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className={cn(
                      "min-w-[2rem] text-center font-serif text-2xl tabular-nums",
                      (isLow || isSoldOut) && "text-admin-alert"
                    )}
                  >
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateInventoryQty(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-white transition-colors hover:bg-gold-dark"
                    aria-label={`${item.name} 수량 증가`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
