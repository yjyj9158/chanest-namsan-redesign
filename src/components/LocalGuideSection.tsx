"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Banknote, ExternalLink } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { hotelData, type LocalGuidePlace } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const TAB_META = [
  { id: "cafe" as const, emoji: "☕", labelKey: "cafe" as const },
  { id: "dining" as const, emoji: "🍽", labelKey: "dining" as const },
  { id: "sights" as const, emoji: "📸", labelKey: "sights" as const },
];

const COURSES = [
  {
    id: "morning",
    emoji: "☀️",
    title: "아침 산책",
    detail: "장충단공원 → 프릳츠 장충",
    target: { category: "sights" as const, name: "장충단공원" },
  },
  {
    id: "day",
    emoji: "📸",
    title: "낮 데이트",
    detail: "스타벅스 장충라운지R → 남산공원",
    target: { category: "cafe" as const, name: "스타벅스 장충라운지R점" },
  },
  {
    id: "evening",
    emoji: "🌙",
    title: "특별한 저녁",
    detail: "서울다이닝 또는 라연",
    target: { category: "dining" as const, name: "서울다이닝" },
  },
];

function placeId(place: Pick<LocalGuidePlace, "category" | "name">) {
  return `place-${place.category}-${place.name.replace(/\s+/g, "-")}`;
}

function needsTransit(distance: string) {
  return /대중교통|버스/.test(distance);
}

export function LocalGuideSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<(typeof TAB_META)[number]["id"]>("cafe");

  const places = useMemo(
    () => hotelData.localGuide.filter((p) => p.category === activeTab),
    [activeTab]
  );

  const tabs = TAB_META.map((tab) => ({
    ...tab,
    label: t[tab.labelKey],
  }));

  function goToPlace(category: LocalGuidePlace["category"], name: string) {
    setActiveTab(category);
    window.setTimeout(() => {
      document
        .getElementById(placeId({ category, name }))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 360);
  }

  return (
    <section id="local" className="px-6 py-20">
      <SectionHeader
        eyebrow={t.localEyebrow}
        title={t.localTitle}
        description={t.localDescription}
        className="mb-8"
      />

      <div className="mb-8">
        <p className="mb-3 text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase">
          {t.hostCourses}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {COURSES.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => goToPlace(course.target.category, course.target.name)}
              className="rounded-2xl border border-charcoal/8 bg-white p-3.5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-lg">{course.emoji}</div>
              <div className="mt-1 text-sm font-medium text-charcoal">{course.title}</div>
              <p className="mt-0.5 text-[0.72rem] leading-relaxed text-muted">
                {course.detail}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        {tabs.map((tab) => (
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
            <span className="text-[0.68rem] font-medium tracking-wide">
              {tab.emoji} {tab.label}
            </span>
          </button>
        ))}
      </div>

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
            <PlaceCard
              key={`${place.category}-${place.name}`}
              place={place}
              index={idx}
              viewMapLabel={t.viewMap}
              walkLabel={t.walk}
              transitLabel={t.transitRecommended}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function localizeDistance(distance: string, walk: string, transit: string) {
  return distance.replaceAll("도보", walk).replaceAll("대중교통 추천", transit);
}

function PlaceCard({
  place,
  index,
  viewMapLabel,
  walkLabel,
  transitLabel,
}: {
  place: LocalGuidePlace;
  index: number;
  viewMapLabel: string;
  walkLabel: string;
  transitLabel: string;
}) {
  const transit = needsTransit(place.distance);

  return (
    <motion.div
      id={placeId(place)}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl border border-charcoal/6 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="font-medium text-charcoal">{place.name}</h3>
      <p className="mt-0.5 text-[0.72rem] text-muted-light">{place.nameEn}</p>
      <p className="mt-2 font-serif text-sm leading-relaxed text-gold-dark italic">
        {place.recommendation}
      </p>
      <div className="mt-3 flex flex-col gap-1.5 text-[0.72rem] text-muted">
        <div className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {transit ? "🚌 " : ""}
            {localizeDistance(place.distance, walkLabel, transitLabel)}
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{place.hours}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{place.priceRange}</span>
        </div>
      </div>
      <a
        href={place.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-3.5 py-2 text-[0.72rem] font-medium text-charcoal transition-colors hover:border-gold/40 hover:bg-gold-soft"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {viewMapLabel}
      </a>
    </motion.div>
  );
}
