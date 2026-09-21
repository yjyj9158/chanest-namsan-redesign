"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { AIRBNB_LISTING_URL } from "@/lib/brandConfig";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/rooms", key: "rooms" as const },
  { href: "/designers", key: "designers" as const },
  { href: "/about", key: "about" as const },
];

export function BrandHeader() {
  const copy = useBrandCopy();
  const pathname = usePathname() ?? "/";
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 88 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !overlay || scrolled || open;
  const lightText = overlay && !solid;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out",
          solid ? "bg-cream/95 shadow-[0_1px_0_rgba(26,24,20,0.06)] backdrop-blur-md" : "bg-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="group leading-none">
            <span
              className={cn(
                "block font-serif text-[0.72rem] tracking-[0.32em] transition-colors md:text-[0.78rem]",
                lightText ? "text-white" : "text-charcoal",
              )}
            >
              THE CHANEST
            </span>
            <span
              className={cn(
                "mt-1 block text-[0.58rem] tracking-[0.42em] uppercase transition-colors",
                lightText ? "text-white/55" : "text-gold",
              )}
            >
              Namsan
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.72rem] tracking-[0.18em] uppercase transition-colors",
                  lightText
                    ? "text-white/80 hover:text-white"
                    : "text-charcoal/70 hover:text-charcoal",
                  pathname.startsWith(item.href) && (lightText ? "text-white" : "text-charcoal"),
                )}
              >
                {copy.nav[item.key]}
              </Link>
            ))}
            <LanguageSwitcher variant={lightText ? "hero" : "light"} />
            <a
              href={AIRBNB_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "rounded-full px-4 py-2 text-[0.72rem] tracking-[0.16em] uppercase transition-colors",
                lightText
                  ? "bg-white/12 text-white ring-1 ring-white/25 hover:bg-white/20"
                  : "bg-charcoal text-cream hover:bg-charcoal-light",
              )}
            >
              {copy.nav.book}
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher variant={lightText ? "hero" : "light"} />
            <button
              type="button"
              aria-label={open ? copy.nav.close : copy.nav.menu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "relative h-10 w-10 rounded-full",
                lightText ? "text-white" : "text-charcoal",
              )}
            >
              <span
                className={cn(
                  "absolute left-2.5 right-2.5 h-px bg-current transition-transform duration-300",
                  open ? "top-1/2 rotate-45" : "top-[14px]",
                )}
              />
              <span
                className={cn(
                  "absolute left-2.5 right-2.5 top-1/2 h-px bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-2.5 right-2.5 h-px bg-current transition-transform duration-300",
                  open ? "top-1/2 -rotate-45" : "bottom-[14px] top-auto",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-cream px-8 pt-28 pb-12 md:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45 }}
                >
                  <Link
                    href={item.href}
                    className="font-serif text-4xl tracking-wide text-charcoal"
                    onClick={() => setOpen(false)}
                  >
                    {copy.nav[item.key]}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={AIRBNB_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="mt-4 inline-flex w-fit rounded-full bg-charcoal px-6 py-3 text-[0.78rem] tracking-[0.18em] text-cream uppercase"
              >
                {copy.nav.book}
              </motion.a>
            </nav>
            <p className="text-[0.65rem] tracking-[0.28em] text-gold uppercase">
              THE CHANEST NAMSAN
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
