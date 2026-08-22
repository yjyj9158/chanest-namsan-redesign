"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Instagram } from "lucide-react";
import { hotelData } from "@/data/hotelData";

const links = [
  {
    href: "tel:010-3223-5714",
    label: "전화",
    icon: Phone,
    external: false,
  },
  {
    href: "https://pf.kakao.com/",
    label: "카카오톡",
    icon: MessageCircle,
    external: true,
  },
  {
    href: "https://instagram.com/11",
    label: "Instagram",
    icon: Instagram,
    external: true,
  },
];

export function FloatingConcierge() {
  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 24 }}
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-charcoal/6 bg-white/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Concierge contact bar"
    >
      <div className="mx-auto flex max-w-lg items-stretch px-2 py-2">
        {links.map(({ href, label, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors hover:text-gold-dark"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark transition-all group-hover:bg-gold-soft group-hover:scale-105">
              <Icon className="h-[18px] w-[18px] text-charcoal group-hover:text-gold-dark" strokeWidth={1.5} />
            </div>
            <span className="text-[0.62rem] font-medium tracking-wide text-muted group-hover:text-gold-dark">
              {label}
            </span>
          </a>
        ))}
      </div>
    </motion.nav>
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
