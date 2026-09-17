"use client";

import { ClipboardList, Package, MessageSquareText } from "lucide-react";
import { ADMIN_TABS, type AdminTab } from "../_data/mock";
import { cn } from "@/lib/utils";

const ICONS = {
  orders: ClipboardList,
  inventory: Package,
  requests: MessageSquareText,
} as const;

interface AdminNavProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  counts?: Partial<Record<AdminTab, number>>;
}

export function AdminNav({ active, onChange, counts }: AdminNavProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col bg-charcoal text-white md:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <div className="font-serif text-lg tracking-[0.18em]">THE CHANEST</div>
          <div className="mt-1 text-[0.65rem] font-medium tracking-[0.28em] text-gold">
            NAMSAN · ADMIN
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="관리 메뉴">
          {ADMIN_TABS.map((tab) => {
            const Icon = ICONS[tab.id];
            const isActive = active === tab.id;
            const count = counts?.[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition-colors",
                  isActive
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/6 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="flex-1 font-medium">{tab.label}</span>
                {typeof count === "number" && count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.65rem] font-medium tabular-nums",
                      isActive ? "bg-gold text-charcoal" : "bg-white/15 text-white/80"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[0.65rem] tracking-wide text-white/30">
          UI shell · no DB yet
        </div>
      </aside>

      {/* Mobile top header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur-md md:hidden"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div>
          <div className="font-serif text-base tracking-[0.16em]">THE CHANEST</div>
          <div className="text-[0.6rem] font-medium tracking-[0.22em] text-gold">
            ADMIN
          </div>
        </div>
        <div className="rounded-full bg-cream px-3 py-1 text-[0.68rem] font-medium text-muted">
          {ADMIN_TABS.find((t) => t.id === active)?.label}
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="모바일 관리 탭"
      >
        <div className="mx-auto flex max-w-lg items-stretch">
          {ADMIN_TABS.map((tab) => {
            const Icon = ICONS[tab.id];
            const isActive = active === tab.id;
            const count = counts?.[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.62rem] font-medium transition-colors",
                  isActive ? "text-charcoal" : "text-muted-light"
                )}
              >
                <Icon
                  className={cn("h-5 w-5", isActive && "text-gold-dark")}
                  strokeWidth={1.5}
                />
                <span>{tab.label}</span>
                {typeof count === "number" && count > 0 && (
                  <span className="absolute top-1.5 right-[22%] flex h-4 min-w-4 items-center justify-center rounded-full bg-admin-alert px-1 text-[0.58rem] text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
