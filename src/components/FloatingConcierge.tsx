"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone, MessageCircle, Instagram } from "lucide-react";
import { hotelData } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { HOST_KAKAO_OPEN_CHAT } from "@/lib/hostContacts";

export function FloatingConcierge() {
  const { t } = useLanguage();
  const { hasAnythingSelected } = useOrder();

  const links = [
    {
      href: "tel:010-3223-5714",
      label: t.call,
      icon: Phone,
      external: false,
    },
    {
      href: HOST_KAKAO_OPEN_CHAT,
      label: t.kakao,
      icon: MessageCircle,
      external: true,
    },
    {
      href: "https://instagram.com/11",
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
  return (
    <footer className="bg-charcoal px-6 pt-12 pb-32 text-center">
      <p className="text-[0.65rem] font-medium tracking-[0.25em] text-white/30 uppercase">
        {hotelData.siteContent.footerText}
      </p>
      <div className="mt-4 font-serif text-lg tracking-[0.25em] text-white/15">
        {hotelData.siteContent.brandName}
      </div>
    </footer>
  );
}
