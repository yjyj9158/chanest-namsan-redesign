"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { useGuestPreference } from "@/hooks/useGuestPreference";
import { SectionHeader } from "@/components/SectionHeader";

export function MyPreferencesCard() {
  const { t } = useLanguage();
  const { preference, loaded, room } = useGuestPreference();

  if (!loaded || !preference) return null;

  const rows = [
    preference.scent
      ? {
          label: t.prefs.scent,
          value: {
            woody: t.prefs.scentWoody,
            citrus: t.prefs.scentCitrus,
            floral: t.prefs.scentFloral,
            unscented: t.prefs.scentUnscented,
          }[preference.scent] ?? preference.scent,
        }
      : null,
    preference.pillow_firmness
      ? {
          label: t.prefs.pillow,
          value: {
            firm: t.prefs.pillowFirm,
            medium: t.prefs.pillowMedium,
            soft: t.prefs.pillowSoft,
          }[preference.pillow_firmness] ?? preference.pillow_firmness,
        }
      : null,
    preference.lighting
      ? {
          label: t.prefs.lighting,
          value: {
            bright: t.prefs.lightingBright,
            soft: t.prefs.lightingSoft,
          }[preference.lighting] ?? preference.lighting,
        }
      : null,
    preference.temperature
      ? {
          label: t.prefs.temperature,
          value: {
            cool: t.prefs.tempCool,
            moderate: t.prefs.tempModerate,
            warm: t.prefs.tempWarm,
          }[preference.temperature] ?? preference.temperature,
        }
      : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  if (rows.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <SectionHeader
        eyebrow="My Preferences"
        title={t.prefs.myPrefsTitle}
        className="mb-8"
      />
      <article className="rounded-2xl border border-charcoal/6 bg-white p-5 shadow-sm">
        <dl className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">{row.label.replace(/\s*\(.*\)$/, "")}</dt>
              <dd className="text-sm font-medium text-charcoal">{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/r/${room.roomNumber}/preferences`}
          className="mt-5 inline-flex rounded-full border border-charcoal/10 px-4 py-2 text-[0.78rem] text-gold-dark"
        >
          {t.prefs.myPrefsEdit}
        </Link>
      </article>
    </section>
  );
}
