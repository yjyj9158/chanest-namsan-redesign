"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useGuestPreference } from "@/hooks/useGuestPreference";

function dismissKey(roomNumber: string) {
  return `chanest-pref-banner-hidden:${roomNumber}`;
}

export function PreferencesBanner() {
  const { t } = useLanguage();
  const { preference, loaded, room } = useGuestPreference();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    if (preference) {
      setHidden(true);
      return;
    }
    try {
      setHidden(window.localStorage.getItem(dismissKey(room.roomNumber)) === "1");
    } catch {
      setHidden(false);
    }
  }, [loaded, preference, room.roomNumber]);

  if (!loaded || preference || hidden) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(dismissKey(room.roomNumber), "1");
    } catch {
      /* ignore */
    }
    setHidden(true);
  }

  return (
    <section className="px-6 pt-8">
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gold-soft/40 px-5 py-5">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/60"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="pr-8 text-[0.95rem] font-medium text-charcoal">
          ✨ {t.prefs.bannerTitle}
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {t.prefs.bannerBody}
        </p>
        <Link
          href={`/r/${room.roomNumber}/preferences`}
          className="mt-4 inline-flex rounded-full bg-charcoal px-4 py-2.5 text-[0.78rem] font-medium tracking-wide text-white"
        >
          {t.prefs.bannerCta}
        </Link>
      </div>
    </section>
  );
}
