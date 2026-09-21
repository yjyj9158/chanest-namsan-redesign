"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

export function BrandCursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("brand-cursor-on");

    const onMove = (event: MouseEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      setVisible(true);
      const hit = (event.target as HTMLElement | null)?.closest(
        "a, button, img, [data-cursor]",
      );
      setHover(Boolean(hit));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      const el = dotRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("brand-cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className={`flex items-center justify-center rounded-full border border-gold/70 bg-cream/15 backdrop-blur-[2px] transition-[width,height,background-color] duration-500 ease-out ${
          hover ? "h-16 w-16 bg-gold/25" : "h-3 w-3"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <span
          className={`font-sans text-[0.58rem] tracking-[0.28em] text-gold uppercase transition-opacity duration-500 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          View
        </span>
      </div>
    </div>
  );
}
