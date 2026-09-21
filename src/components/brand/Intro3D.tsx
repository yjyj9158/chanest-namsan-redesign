"use client";

import dynamic from "next/dynamic";
import { SPLINE_SCENE_URL } from "@/lib/brandConfig";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const Hero3D = dynamic(() => import("@/components/brand/Hero3D"), {
  ssr: false,
  loading: () => null,
});

const SplineScene = dynamic(() => import("@/components/brand/SplineScene"), {
  ssr: false,
  loading: () => null,
});

export function Intro3D() {
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  if (!desktop || reduced) return null;
  if (SPLINE_SCENE_URL) return <SplineScene url={SPLINE_SCENE_URL} />;
  return <Hero3D />;
}
