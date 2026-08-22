"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import {
  hotelData,
  formatKRW,
  type MinibarItem,
} from "@/data/hotelData";
import { cn } from "@/lib/utils";

type Cart = Record<number, number>;

export function MinibarSection() {
  const { siteContent, minibarCategories, minibarItems } = hotelData;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cart, setCart] = useState<Cart>({});

  const categories = ["All", ...minibarCategories.map((c) => c.name)];

  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? minibarItems
        : minibarItems.filter((i) => i.category === activeCategory),
    [activeCategory, minibarItems]
  );

  const total = useMemo(
    () =>
      minibarItems.reduce(
        (sum, item) => sum + item.price * (cart[item.id] ?? 0),
        0
      ),
    [cart, minibarItems]
  );

  const itemCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart]
  );

  function updateQty(id: number, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) delete next[id];
      else next[id] = updated;
      return next;
    });
  }

  function resetCart() {
    setCart({});
  }

  return (
    <section id="minibar" className="px-6 py-20">
      <SectionHeader
        eyebrow="In-Room"
        title={siteContent.minibarTitle}
        description={siteContent.minibarDescription}
        className="mb-8"
      />

      {/* Category tabs */}
      <div className="no-scrollbar -mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-[0.72rem] font-medium tracking-wider uppercase transition-all",
              activeCategory === cat
                ? "bg-charcoal text-white shadow-md"
                : "border border-charcoal/10 bg-white text-muted hover:border-gold hover:text-gold-dark"
            )}
          >
            {cat === "All" ? "All Items" : cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <MinibarCard
              key={item.id}
              item={item}
              qty={cart[item.id] ?? 0}
              onUpdate={(delta) => updateQty(item.id, delta)}
              index={idx}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Calculator bar */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-4 bottom-24 left-4 z-40 mx-auto max-w-md"
          >
            <div className="flex items-center justify-between rounded-2xl border border-charcoal/8 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-xl">
              <div>
                <div className="text-[0.65rem] font-medium tracking-widest text-muted uppercase">
                  Minibar Total
                </div>
                <div className="font-serif text-2xl text-charcoal">
                  {formatKRW(total)}
                </div>
                <div className="text-xs text-muted-light">
                  {itemCount} item{itemCount > 1 ? "s" : ""} selected
                </div>
              </div>
              <button
                onClick={resetCart}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-dark text-muted transition-colors hover:bg-gold-soft hover:text-gold-dark"
                aria-label="Reset cart"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MinibarCard({
  item,
  qty,
  onUpdate,
  index,
}: {
  item: MinibarItem;
  qty: number;
  onUpdate: (delta: number) => void;
  index: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-shadow",
        qty > 0
          ? "border-gold/40 shadow-md shadow-gold/10"
          : "border-charcoal/6 shadow-sm"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
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
            onClick={() => onUpdate(-1)}
            disabled={qty === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-charcoal/10 transition-colors enabled:hover:border-gold enabled:hover:text-gold-dark disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            className={cn(
              "min-w-[1.5rem] text-center text-sm font-medium tabular-nums",
              qty > 0 && "text-gold-dark"
            )}
          >
            {qty}
          </span>
          <button
            onClick={() => onUpdate(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-white transition-colors hover:bg-gold-dark"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
