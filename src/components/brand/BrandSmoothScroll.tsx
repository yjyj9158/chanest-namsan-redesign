"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsapBrand";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

type LenisContextValue = {
  lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useBrandLenis() {
  return useContext(LenisContext);
}

const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function BrandSmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("brand-lenis");

    if (reduced) {
      html.classList.remove("lenis", "lenis-smooth");
      return () => html.classList.remove("brand-lenis");
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: expoOut,
      smoothWheel: true,
      autoRaf: false,
    });

    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      event.preventDefault();
      instance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(ticker);
      instance.destroy();
      setLenis(null);
      html.classList.remove("brand-lenis", "lenis", "lenis-smooth");
    };
  }, [reduced]);

  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
