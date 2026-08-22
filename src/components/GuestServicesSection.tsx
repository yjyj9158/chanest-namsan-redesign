"use client";

import { motion } from "framer-motion";
import {
  Bath,
  Droplets,
  Minus,
  Plus,
  Sparkles,
  MessageSquare,
  Check,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder, type ServiceSelection } from "@/context/OrderContext";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS: {
  key: keyof ServiceSelection;
  icon: typeof Bath;
  labelKey:
    | "serviceTowels"
    | "serviceAmenities"
    | "serviceHousekeeping"
    | "serviceOther";
  descKey:
    | "serviceTowelsDesc"
    | "serviceAmenitiesDesc"
    | "serviceHousekeepingDesc"
    | "serviceOtherDesc";
}[] = [
  {
    key: "towels",
    icon: Bath,
    labelKey: "serviceTowels",
    descKey: "serviceTowelsDesc",
  },
  {
    key: "amenities",
    icon: Droplets,
    labelKey: "serviceAmenities",
    descKey: "serviceAmenitiesDesc",
  },
  {
    key: "housekeeping",
    icon: Sparkles,
    labelKey: "serviceHousekeeping",
    descKey: "serviceHousekeepingDesc",
  },
  {
    key: "other",
    icon: MessageSquare,
    labelKey: "serviceOther",
    descKey: "serviceOtherDesc",
  },
];

export function GuestServicesSection() {
  const { t } = useLanguage();
  const {
    waterQty,
    updateWaterQty,
    services,
    toggleService,
    note,
    setNote,
  } = useOrder();

  return (
    <section id="services" className="px-6 py-20">
      <SectionHeader
        eyebrow={t.serviceEyebrow}
        title={t.serviceTitle}
        description={t.serviceDescription}
        className="mb-10"
      />

      {/* Free water */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        className="mb-4 overflow-hidden rounded-2xl border border-charcoal/6 bg-white p-5 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
            <Droplets className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-xl">{t.waterTitle}</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wide text-emerald-700">
                {t.waterFree}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t.waterDescription}
            </p>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
              <span className="text-sm font-medium">{t.waterQty}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateWaterQty(-1)}
                  disabled={waterQty === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/10 transition-colors enabled:hover:border-gold enabled:hover:text-gold-dark disabled:opacity-30"
                  aria-label="Decrease water"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className={cn(
                    "min-w-[1.75rem] text-center text-base font-medium tabular-nums",
                    waterQty > 0 && "text-gold-dark"
                  )}
                >
                  {waterQty}
                </span>
                <button
                  type="button"
                  onClick={() => updateWaterQty(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-white transition-colors hover:bg-gold-dark"
                  aria-label="Increase water"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Service checklist */}
      <div className="mb-4 flex flex-col gap-3">
        {SERVICE_OPTIONS.map((opt, idx) => {
          const Icon = opt.icon;
          const active = services[opt.key];
          return (
            <motion.button
              key={opt.key}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleService(opt.key)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-gold/40 bg-white shadow-md shadow-gold/10"
                  : "border-charcoal/6 bg-white shadow-sm hover:border-gold/25"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  active ? "bg-charcoal text-white" : "bg-gold-soft text-gold-dark"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-lg">{t[opt.labelKey]}</div>
                <p className="mt-0.5 text-sm text-muted">{t[opt.descKey]}</p>
              </div>
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  active
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-charcoal/20"
                )}
              >
                {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-charcoal/6 bg-white p-5 shadow-sm"
      >
        <label htmlFor="service-note" className="font-serif text-lg">
          {t.serviceNoteLabel}
        </label>
        <p className="mt-1 text-sm text-muted">{t.serviceNoteHint}</p>
        <textarea
          id="service-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t.serviceNotePlaceholder}
          className="mt-3 w-full resize-none rounded-xl border border-charcoal/10 bg-cream px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-light focus:border-gold/50"
        />
      </motion.div>
    </section>
  );
}
