"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LOCALES, type Locale } from "@/i18n/translations";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Hero 헤더용 반투명 다크 스타일 */
  variant?: "hero" | "light";
  className?: string;
}

export function LanguageSwitcher({
  variant = "hero",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function select(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  const isHero = variant === "hero";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.language}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.68rem] font-medium tracking-wider backdrop-blur-md transition-colors",
          isHero
            ? "border border-white/20 bg-white/10 text-white hover:bg-white/18"
            : "border border-charcoal/10 bg-white text-charcoal hover:border-gold/40"
        )}
      >
        <Languages className="h-3.5 w-3.5 opacity-80" strokeWidth={1.5} />
        <span>{current.short}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 opacity-70 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.language}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "absolute right-0 z-50 mt-2 min-w-[148px] overflow-hidden rounded-2xl border py-1.5 shadow-xl",
              isHero
                ? "border-white/15 bg-charcoal/95 text-white backdrop-blur-xl"
                : "border-charcoal/8 bg-white text-charcoal"
            )}
          >
            {LOCALES.map((item) => {
              const active = item.code === locale;
              return (
                <li key={item.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => select(item.code)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[0.78rem] transition-colors",
                      isHero
                        ? active
                          ? "bg-white/12 text-gold"
                          : "hover:bg-white/8"
                        : active
                          ? "bg-gold-soft text-gold-dark"
                          : "hover:bg-cream"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-[0.65rem] font-semibold tracking-wider opacity-60">
                        {item.short}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
