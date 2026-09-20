import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(
  iso: string,
  labels?: {
    timeJustNow: string;
    timeMinutesAgo: (n: number) => string;
    timeHoursAgo: (n: number) => string;
    timeDaysAgo: (n: number) => string;
  },
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return labels?.timeJustNow ?? "방금";
  if (minutes < 60) return labels?.timeMinutesAgo(minutes) ?? `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return labels?.timeHoursAgo(hours) ?? `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return labels?.timeDaysAgo(days) ?? `${days}일 전`;
}
