"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

export function BrandCurtain() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const first = useRef(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), 620);
    return () => window.clearTimeout(timer);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={pathname}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] bg-cream"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
