"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { hotelData } from "@/data/hotelData";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

export function Hero() {
  const { siteContent, room } = hotelData;
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-svh">
      <div className="absolute inset-0">
        <Image
          src={siteContent.heroImage}
          alt={t.heroImageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/10 via-35% to-charcoal/90" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-20 flex items-center justify-between gap-3 px-5 pt-6 sm:px-6"
      >
        <div className="min-w-0 leading-tight text-white">
          <div className="font-serif text-[1.05rem] tracking-[0.2em]">
            {siteContent.brandName}
          </div>
          <div className="mt-0.5 text-[0.62rem] font-medium tracking-[0.35em] text-gold">
            {siteContent.brandLocation}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md sm:px-4">
            <span className="text-[0.62rem] font-medium tracking-widest text-white/70 uppercase">
              {t.room}{" "}
            </span>
            <span className="font-serif text-lg text-white">{room}</span>
          </div>
          <LanguageSwitcher variant="hero" />
        </div>
      </motion.header>

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="mb-4 text-[0.72rem] font-medium tracking-[0.25em] text-gold uppercase">
            {t.heroKicker}
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,7vw,3.5rem)] leading-[1.12] whitespace-pre-line text-white">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed font-light whitespace-pre-line text-white/75">
            {t.introText}
          </p>
          <a
            href="#minibar"
            className="mt-8 inline-flex items-center rounded-full bg-cream px-7 py-3.5 text-[0.78rem] font-medium tracking-widest text-charcoal uppercase transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t.exploreStay}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] tracking-[0.2em] text-white/40 uppercase"
        >
          <span>{t.scroll}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
