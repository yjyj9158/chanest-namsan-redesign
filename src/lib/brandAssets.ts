"use client";

import { useEffect, useState } from "react";
import { hotelData } from "@/data/hotelData";

const { siteContent } = hotelData;

export const BRAND_LOCAL_PATHS = {
  hero: "/images/brand/hero.jpg",
  suite02: "/images/brand/suite02.jpg",
  garden: "/images/brand/garden.jpg",
  detail1: "/images/brand/detail1.jpg",
  detail2: "/images/brand/detail2.jpg",
  location: "/images/brand/location.jpg",
  texture: "/images/brand/texture.jpg",
} as const;

export const BRAND_FALLBACKS = {
  hero: siteContent.heroImage,
  suite02: siteContent.heroImage,
  garden: siteContent.guideImage,
  detail1: siteContent.minibarImage,
  detail2: siteContent.serviceImage,
  location: siteContent.contactImage,
  texture: siteContent.guideImage,
} as const;

export type BrandAssetKey = keyof typeof BRAND_LOCAL_PATHS;

export function getBrandAsset(key: BrandAssetKey) {
  return { local: BRAND_LOCAL_PATHS[key], fallback: BRAND_FALLBACKS[key] };
}

/** Prefer a local brand still when present; otherwise keep the existing CDN image. */
export function useBrandSrc(key: BrandAssetKey) {
  const { local, fallback } = getBrandAsset(key);
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setSrc(local);
    };
    probe.onerror = () => {
      if (!cancelled) setSrc(fallback);
    };
    probe.src = local;
    return () => {
      cancelled = true;
    };
  }, [local, fallback]);

  return src;
}
