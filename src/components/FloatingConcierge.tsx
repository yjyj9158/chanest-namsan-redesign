"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Instagram } from "lucide-react";
import { hotelData } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { HOST_PHONE_DISPLAY } from "@/lib/hostContacts";

export function FloatingConcierge() {
  const { t } = useLanguage();
  const { hasAnythingSelected } = useOrder();

  const links = [
    {
      href: `tel:${HOST_PHONE_DISPLAY}`,
      label: t.call,
      icon: Phone,
      external: false,
    },
    {
      // 실제 인스타 계정으로 교체 필요
      href: "https://instagram.com/thechanest_namsan",
      label: t.instagram,
      icon: Instagram,
      external: true,
    },
  ];

  return (
    <AnimatePresence>
      {!hasAnythingSelected && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-charcoal/6 bg-white/90 backdrop-blur-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          aria-label="Concierge contact bar"
        >
          <div className="mx-auto flex max-w-lg items-stretch px-2 py-2">
            {links.map(({ href, label, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors hover:text-gold-dark"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark transition-all group-hover:scale-105 group-hover:bg-gold-soft">
                  <Icon
                    className="h-[18px] w-[18px] text-charcoal group-hover:text-gold-dark"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[0.62rem] font-medium tracking-wide text-muted group-hover:text-gold-dark">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal px-6 pt-12 pb-32 text-center">
      <p className="text-[0.65rem] font-medium tracking-[0.25em] text-white/30 uppercase">
        {hotelData.siteContent.footerText}
      </p>
      <div className="mt-4 font-serif text-lg tracking-[0.25em] text-white/15">
        {hotelData.siteContent.brandName}
      </div>
      <Link
        href="/privacy"
        className="mt-6 inline-block text-[0.72rem] text-white/35 underline-offset-4 transition-colors hover:text-gold hover:underline"
      >
        {t.privacyPolicy}
      </Link>
    </footer>
  );
}
