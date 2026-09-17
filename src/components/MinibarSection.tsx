"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { formatKRW } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import type { LiveMinibarItem } from "@/lib/minibarCatalog";

type FilterTab = "All" | "Snack" | "Soft Drink" | "Alcohol";

const ALCOHOL_CATEGORIES = new Set(["Whisky", "Wine", "Soju", "Highball"]);

const FILTER_TABS: FilterTab[] = ["All", "Snack", "Soft Drink", "Alcohol"];

function matchesFilter(item: LiveMinibarItem, tab: FilterTab): boolean {
  if (tab === "All") return true;
  if (tab === "Alcohol") return ALCOHOL_CATEGORIES.has(item.category);
  return item.category === tab;
}

export function MinibarSection() {
  const { t } = useLanguage();
  const { minibarItems, minibarCart, updateMinibarQty } = useOrder();
  // 기본: Snack만 표시 (전 상품 일괄 펼침 방지)
  const [activeTab, setActiveTab] = useState<FilterTab>("Snack");

  const filteredItems = useMemo(
    () => minibarItems.filter((item) => matchesFilter(item, activeTab)),
    [activeTab, minibarItems]
  );

  function tabLabel(tab: FilterTab) {
    if (tab === "All") return t.tabAll;
    if (tab === "Alcohol") return t.tabAlcohol;
    return tab;
  }

  return (
    <section id="minibar" className="px-6 py-20">
      <SectionHeader
        eyebrow={t.minibarEyebrow}
        title={t.minibarTitle}
        description={t.minibarDescription}
        className="mb-8"
      />

      <div className="no-scrollbar -mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-[0.72rem] font-medium tracking-wider uppercase transition-all",
              activeTab === tab
                ? "bg-charcoal text-white shadow-md"
                : "border border-charcoal/10 bg-white text-muted hover:border-gold hover:text-gold-dark"
            )}
          >
            {tabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <MinibarCard
              key={item.id}
              item={item}
              qty={minibarCart[item.id] ?? 0}
              onUpdate={(delta) => updateMinibarQty(item.id, delta)}
              index={idx}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">{t.emptyCategory}</p>
      )}
    </section>
  );
}

function MinibarCard({
  item,
  qty,
  onUpdate,
  index,
}: {
  item: LiveMinibarItem;
  qty: number;
  onUpdate: (delta: number) => void;
  index: number;
}) {
  const soldOut = item.available === false;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-shadow",
        soldOut && "opacity-55",
        !soldOut && qty > 0
          ? "border-gold/40 shadow-md shadow-gold/10"
          : "border-charcoal/6 shadow-sm"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={cn("object-cover", soldOut && "grayscale")}
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {soldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-charcoal/75 px-2 py-1.5 text-center text-[0.65rem] font-medium tracking-wide text-white">
            품절
          </div>
        )}
      </div>
      <div className="p-3.5">
        <div className="text-[0.6rem] font-medium tracking-widest text-gold uppercase">
          {item.category}
        </div>
        <h3 className="mt-0.5 line-clamp-2 text-[0.82rem] leading-snug font-medium">
          {item.name}
        </h3>
        <div className="mt-2 font-serif text-base">{formatKRW(item.price)}</div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onUpdate(-1)}
            disabled={soldOut || qty === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-charcoal/10 transition-colors enabled:hover:border-gold enabled:hover:text-gold-dark disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            className={cn(
              "min-w-[1.5rem] text-center text-sm font-medium tabular-nums",
              qty > 0 && !soldOut && "text-gold-dark"
            )}
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => onUpdate(1)}
            disabled={soldOut}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-white transition-colors hover:bg-gold-dark disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
