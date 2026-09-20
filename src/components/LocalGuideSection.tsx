"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Banknote, ExternalLink } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { hotelData, type LocalGuidePlace } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { tx } from "@/i18n/localized";
import type { Locale } from "@/i18n/translations";
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
    titleKey: "courseMorning" as const,
    detailKey: "courseMorningDetail" as const,
    target: { category: "sights" as const, name: "장충단공원" },
  },
  {
    id: "day",
    emoji: "📸",
    titleKey: "courseDay" as const,
    detailKey: "courseDayDetail" as const,
    target: { category: "cafe" as const, name: "스타벅스 장충라운지R점" },
  },
  {
    id: "evening",
    emoji: "🌙",
    titleKey: "courseEvening" as const,
    detailKey: "courseEveningDetail" as const,
    target: { category: "dining" as const, name: "서울다이닝" },
  },
];

function placeId(place: Pick<LocalGuidePlace, "category" | "name">) {
  return `place-${place.category}-${place.name.replace(/\s+/g, "-")}`;
}

function PlaceCard({
  place,
  index,
  locale,
  viewMapLabel,
}: {
  place: LocalGuidePlace;
  index: number;
  locale: Locale;
  viewMapLabel: string;
}) {
  const transit = !!place.transit;

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
        {tx(place.recommendation, locale)}
      </p>
      <div className="mt-3 flex flex-col gap-1.5 text-[0.72rem] text-muted">
        <div className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {transit ? "🚌 " : ""}
            {tx(place.distance, locale)}
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{tx(place.hours, locale)}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{tx(place.priceRange, locale)}</span>
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

export function LocalGuideSection() {
  const { t, locale } = useLanguage();
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
              <div className="mt-1 text-sm font-medium text-charcoal">{t[course.titleKey]}</div>
              <p className="mt-0.5 text-[0.72rem] leading-relaxed text-muted">
                {t[course.detailKey]}
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
              locale={locale}
              viewMapLabel={t.viewMap}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
