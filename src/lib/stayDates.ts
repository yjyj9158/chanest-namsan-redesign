export function seoulDateString(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

export function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function stayStatusFromDates(
  checkIn: string | null | undefined,
  _checkOut: string | null | undefined,
  today = seoulDateString(),
): "upcoming" | "current" {
  if (checkIn && checkIn > today) return "upcoming";
  return "current";
}

export function formatStayRange(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
): string {
  const inLabel = checkIn ? formatShortDate(checkIn) : "미정";
  const outLabel = checkOut ? formatShortDate(checkOut) : "미정";
  return `${inLabel} 체크인 → ${outLabel} 체크아웃`;
}

export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function maskGuestName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "게스트";
  if (trimmed.length === 1) return `${trimmed}○○`;
  return `${trimmed[0]}○○`;
}
