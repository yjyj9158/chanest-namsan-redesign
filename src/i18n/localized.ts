import type { Locale } from "@/i18n/translations";

export type LocalizedText = {
  ko: string;
  en: string;
  ja: string;
  zh: string;
};

export function tx(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.ko;
}

export function naverMapUrl(query: string): string {
  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}
