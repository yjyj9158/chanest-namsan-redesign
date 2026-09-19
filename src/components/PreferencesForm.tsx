"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRoom } from "@/context/RoomContext";
import { LOCALES, type Locale } from "@/i18n/translations";
import { cn } from "@/lib/utils";
import {
  LIGHTING_OPTIONS,
  PARTY_OPTIONS,
  PILLOW_OPTIONS,
  SCENT_OPTIONS,
  TEMPERATURE_OPTIONS,
  type LightingId,
  type PartyId,
  type PillowId,
  type ScentId,
  type TemperatureId,
} from "@/lib/preferenceOptions";

function ToggleCard({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3.5 text-sm transition-colors",
        selected
          ? "border-gold bg-gold-soft text-charcoal shadow-[0_8px_24px_rgba(184,149,90,0.18)]"
          : "border-charcoal/10 bg-white text-muted hover:border-gold/40",
      )}
    >
      {label}
    </button>
  );
}

function LanguageGate({ onPick }: { onPick: (locale: Locale) => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-6 py-16 text-charcoal">
      <div className="w-full max-w-sm text-center">
        <p className="font-serif text-[1.15rem] tracking-[0.28em]">THE CHANEST</p>
        <p className="mt-1 text-[0.68rem] font-medium tracking-[0.35em] text-gold">
          NAMSAN
        </p>
        <h1 className="mt-12 font-serif text-[1.7rem] leading-snug">
          Please select your language
        </h1>
        <p className="mt-3 text-sm text-muted">언어를 선택해 주세요</p>
        <div className="mt-10 flex flex-col gap-3">
          {LOCALES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onPick(item.code)}
              className="rounded-2xl border border-charcoal/10 bg-white px-6 py-4 text-base tracking-wide text-charcoal transition-colors hover:border-gold hover:bg-gold-soft"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export function PreferencesForm() {
  const { t, setLocale, hydrated, hasStoredLocale } = useLanguage();
  const { room } = useRoom();
  const [step, setStep] = useState<"boot" | "lang" | "form">("boot");
  const [scent, setScent] = useState<ScentId | null>(null);
  const [pillow, setPillow] = useState<PillowId | null>(null);
  const [lighting, setLighting] = useState<LightingId | null>(null);
  const [temperature, setTemperature] = useState<TemperatureId | null>(null);
  const [party, setParty] = useState<PartyId | null>(null);
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [previous, setPrevious] = useState<{
    id?: string;
    scent?: string | null;
    pillow_firmness?: string | null;
    lighting?: string | null;
    temperature?: string | null;
    party_type?: string | null;
    special_request?: string | null;
  } | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setStep(hasStoredLocale ? "form" : "lang");
  }, [hydrated, hasStoredLocale]);

  useEffect(() => {
    if (step !== "form") return;
    let cancelled = false;
    async function loadExisting() {
      try {
        const params = new URLSearchParams({ room: room.roomNumber });
        if (room.id) params.set("roomId", room.id);
        const response = await fetch(`/api/preferences?${params.toString()}`);
        const payload = (await response.json()) as {
          preference?: typeof previous;
        };
        if (cancelled || !payload.preference) return;
        const pref = payload.preference;
        setPreferenceId(pref.id ? String(pref.id) : null);
        if (pref.scent) setScent(pref.scent as ScentId);
        if (pref.pillow_firmness) setPillow(pref.pillow_firmness as PillowId);
        if (pref.lighting) setLighting(pref.lighting as LightingId);
        if (pref.temperature) setTemperature(pref.temperature as TemperatureId);
        if (pref.party_type) setParty(pref.party_type as PartyId);
        if (pref.special_request) setNotes(pref.special_request);
      } catch {
        /* ignore */
      }
    }
    void loadExisting();
    return () => {
      cancelled = true;
    };
  }, [step, room.id, room.roomNumber]);

  const guideUrl =
    typeof window === "undefined"
      ? `/r/${room.roomNumber}`
      : `${window.location.origin}/r/${room.roomNumber}`;

  const scentLabels = useMemo(
    () => ({
      woody: t.prefs.scentWoody,
      citrus: t.prefs.scentCitrus,
      floral: t.prefs.scentFloral,
      unscented: t.prefs.scentUnscented,
    }),
    [t],
  );
  const pillowLabels = useMemo(
    () => ({
      firm: t.prefs.pillowFirm,
      medium: t.prefs.pillowMedium,
      soft: t.prefs.pillowSoft,
    }),
    [t],
  );
  const lightingLabels = useMemo(
    () => ({
      bright: t.prefs.lightingBright,
      soft: t.prefs.lightingSoft,
    }),
    [t],
  );
  const tempLabels = useMemo(
    () => ({
      cool: t.prefs.tempCool,
      moderate: t.prefs.tempModerate,
      warm: t.prefs.tempWarm,
    }),
    [t],
  );
  const partyLabels = useMemo(
    () => ({
      couple: t.prefs.partyCouple,
      family: t.prefs.partyFamily,
      friends: t.prefs.partyFriends,
      solo: t.prefs.partySolo,
      business: t.prefs.partyBusiness,
    }),
    [t],
  );

  async function lookupEmail(value: string) {
    const trimmed = value.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setHasPrevious(false);
      setPrevious(null);
      return;
    }
    setCheckingEmail(true);
    try {
      const response = await fetch(
        `/api/preferences?email=${encodeURIComponent(trimmed)}`,
      );
      const payload = (await response.json()) as {
        preference?: typeof previous;
      };
      if (payload.preference) {
        setPrevious(payload.preference);
        setHasPrevious(true);
      } else {
        setPrevious(null);
        setHasPrevious(false);
      }
    } catch {
      setHasPrevious(false);
    } finally {
      setCheckingEmail(false);
    }
  }

  function applyPrevious() {
    if (!previous) return;
    if (previous.id) setPreferenceId(String(previous.id));
    if (previous.scent) setScent(previous.scent as ScentId);
    if (previous.pillow_firmness) setPillow(previous.pillow_firmness as PillowId);
    if (previous.lighting) setLighting(previous.lighting as LightingId);
    if (previous.temperature) setTemperature(previous.temperature as TemperatureId);
    if (previous.party_type) setParty(previous.party_type as PartyId);
    if (previous.special_request) setNotes(previous.special_request);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: room.roomNumber,
          roomId: room.id,
          preferenceId,
          scent,
          pillowFirmness: pillow,
          lighting,
          temperature,
          partyType: party,
          specialRequest: notes.trim() || null,
          guestEmail: email.trim() || null,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? t.prefs.error);
        return;
      }
      setDone(true);
    } catch {
      setError(t.prefs.error);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyGuideLink() {
    try {
      await navigator.clipboard.writeText(guideUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (step === "boot") {
    return <main className="min-h-svh bg-cream" />;
  }

  if (done) {
    return (
      <main className="min-h-svh bg-cream px-6 py-16 text-charcoal">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-gold-dark">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-8 font-serif text-[clamp(2rem,7vw,3rem)] leading-tight">
            {t.prefs.readyTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t.prefs.readyBody}
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-charcoal/10" />
          <p className="mt-8 text-sm leading-relaxed text-muted">
            {t.prefs.readyHint}
          </p>
          <Link
            href={`/r/${room.roomNumber}`}
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-charcoal py-4 text-sm font-medium tracking-wide text-white hover:bg-gold-dark"
          >
            {t.prefs.openGuide}
          </Link>
          <p className="mt-8 text-[0.72rem] tracking-wide text-muted">
            {t.prefs.saveLink}
          </p>
          <p className="mt-1 break-all font-mono text-[0.68rem] text-muted-light">
            {guideUrl}
          </p>
          <button
            type="button"
            onClick={() => void copyGuideLink()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 px-4 py-2 text-sm text-gold-dark"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? t.copied : t.prefs.copyLink}
          </button>
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step === "lang" ? (
        <motion.div
          key="lang"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <LanguageGate
            onPick={(locale) => {
              setLocale(locale);
              setStep("form");
            }}
          />
        </motion.div>
      ) : (
        <motion.main
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="min-h-svh bg-cream px-6 py-12 text-charcoal"
        >
          <div className="mx-auto max-w-lg pb-16">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-medium tracking-[0.28em] text-gold uppercase">
                  THE CHANEST NAMSAN
                </p>
                <p className="mt-2 text-[0.72rem] tracking-[0.18em] text-muted uppercase">
                  Room {room.roomNumber}
                </p>
              </div>
              <LanguageSwitcher variant="light" />
            </header>

            <h1 className="mt-10 font-serif text-[clamp(2rem,7vw,3.1rem)] leading-[1.15]">
              {t.prefs.title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              {t.prefs.subtitle}
            </p>

            <section className="mt-12">
              <h2 className="font-serif text-2xl">{t.prefs.scent}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {SCENT_OPTIONS.map((option) => (
                  <ToggleCard
                    key={option.id}
                    selected={scent === option.id}
                    label={scentLabels[option.id]}
                    onClick={() =>
                      setScent((cur) => (cur === option.id ? null : option.id))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.pillow}</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {PILLOW_OPTIONS.map((option) => (
                  <ToggleCard
                    key={option.id}
                    selected={pillow === option.id}
                    label={pillowLabels[option.id]}
                    onClick={() =>
                      setPillow((cur) => (cur === option.id ? null : option.id))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.lighting}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {LIGHTING_OPTIONS.map((option) => (
                  <ToggleCard
                    key={option.id}
                    selected={lighting === option.id}
                    label={lightingLabels[option.id]}
                    onClick={() =>
                      setLighting((cur) => (cur === option.id ? null : option.id))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.temperature}</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {TEMPERATURE_OPTIONS.map((option) => (
                  <ToggleCard
                    key={option.id}
                    selected={temperature === option.id}
                    label={tempLabels[option.id]}
                    onClick={() =>
                      setTemperature((cur) =>
                        cur === option.id ? null : option.id,
                      )
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.party}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PARTY_OPTIONS.map((option) => (
                  <ToggleCard
                    key={option.id}
                    selected={party === option.id}
                    label={partyLabels[option.id]}
                    onClick={() =>
                      setParty((cur) => (cur === option.id ? null : option.id))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.notes}</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={t.prefs.notesPlaceholder}
                className="mt-4 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-gold"
              />
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-2xl">{t.prefs.email}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t.prefs.emailHint}
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => void lookupEmail(e.target.value)}
                placeholder={t.prefs.emailPlaceholder}
                className="mt-4 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
              />
              {checkingEmail ? (
                <p className="mt-3 text-sm text-muted">{t.prefs.checkingEmail}</p>
              ) : null}
              {hasPrevious ? (
                <button
                  type="button"
                  onClick={applyPrevious}
                  className="mt-3 rounded-full border border-gold/40 bg-gold-soft px-4 py-2 text-sm text-gold-dark"
                >
                  {t.prefs.loadPrevious}
                </button>
              ) : null}
            </section>

            {error ? (
              <p className="mt-8 rounded-2xl border border-admin-alert/30 bg-admin-alert-bg px-4 py-3 text-sm text-admin-alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="mt-10 w-full rounded-full bg-charcoal py-4 text-sm font-medium tracking-wide text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {submitting ? t.prefs.submitting : t.prefs.submit}
            </button>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
