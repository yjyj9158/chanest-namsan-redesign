"use client";

import { useEffect, useState } from "react";

function useMatch(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMatch("(prefers-reduced-motion: reduce)");
}

export function useIsDesktop() {
  return useMatch("(min-width: 768px)");
}

export function useFinePointer() {
  return useMatch("(hover: hover) and (pointer: fine)");
}
