"use client";

import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { brandCopy } from "@/i18n/brandCopy";

export function BrandProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

export function useBrandCopy() {
  const { locale } = useLanguage();
  return brandCopy[locale];
}
