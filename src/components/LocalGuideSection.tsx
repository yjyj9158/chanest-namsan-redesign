"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import {
  hotelData,
  LOCAL_GUIDE_TABS,
  type LocalGuidePlace,
} from "@/data/hotelData";
import { cn } from "@/lib/utils";

export function LocalGuideSection() {
  const [activeTab, setActiveTab] =
    useState<(typeof LOCAL_GUIDE_TABS)[number]["id"]>("cafe");

  const places = useMemo(
    () => hotelData.localGuide.filter((p) => p.category === activeTab),
    [activeTab]
  );

  return (
    <section id="local" className="px-6 py-20">
      <SectionHeader
        eyebrow="Jangchung · Namsan"
        title="Local Guide"
        description="장충동과 남산 주변의 추천 장소를 안내해 드립니다."
        className="mb-8"
      />

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {LOCAL_GUIDE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3.5 text-center transition-all",
              activeTab === tab.id
                ? "bg-charcoal text-white shadow-lg"
                : "border border-charcoal/8 bg-white text-muted hover:border-gold/30"
            )}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-[0.68rem] font-medium tracking-wide">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-3"
        >
          {places.map((place, idx) => (
            <PlaceCard key={place.name} place={place} index={idx} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function PlaceCard({
  place,
  index,
}: {
  place: LocalGuidePlace;
  index: number;
}) {
  const tab = LOCAL_GUIDE_TABS.find((t) => t.id === place.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group flex items-center gap-4 rounded-2xl border border-charcoal/6 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream-dark text-2xl transition-transform group-hover:scale-105">
        {tab?.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-medium">{place.name}</h3>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>장충동 · 남산</span>
        </div>
      </div>
      <div className="shrink-0 rounded-full bg-gold-soft px-3 py-1 text-[0.65rem] font-medium tracking-wide text-gold-dark">
        {tab?.label}
      </div>
    </motion.div>
  );
}
