export const SCENT_OPTIONS = [
  { id: "woody", ko: "우디" },
  { id: "citrus", ko: "시트러스" },
  { id: "floral", ko: "플로럴" },
  { id: "unscented", ko: "무향" },
] as const;

export const PILLOW_OPTIONS = [
  { id: "firm", ko: "단단하게" },
  { id: "medium", ko: "중간" },
  { id: "soft", ko: "부드럽게" },
] as const;

export const LIGHTING_OPTIONS = [
  { id: "bright", ko: "밝게" },
  { id: "soft", ko: "은은하게" },
] as const;

export const TEMPERATURE_OPTIONS = [
  { id: "cool", ko: "시원하게" },
  { id: "moderate", ko: "적당히" },
  { id: "warm", ko: "따뜻하게" },
] as const;

export const PARTY_OPTIONS = [
  { id: "couple", ko: "연인" },
  { id: "family", ko: "가족" },
  { id: "friends", ko: "친구" },
  { id: "solo", ko: "혼자" },
  { id: "business", ko: "비즈니스" },
] as const;

export type ScentId = (typeof SCENT_OPTIONS)[number]["id"];
export type PillowId = (typeof PILLOW_OPTIONS)[number]["id"];
export type LightingId = (typeof LIGHTING_OPTIONS)[number]["id"];
export type TemperatureId = (typeof TEMPERATURE_OPTIONS)[number]["id"];
export type PartyId = (typeof PARTY_OPTIONS)[number]["id"];

export type PreferencePayload = {
  roomNumber: string;
  roomId?: string | null;
  stayId?: string | null;
  preferenceId?: string | null;
  scent?: ScentId | null;
  pillowFirmness?: PillowId | null;
  lighting?: LightingId | null;
  temperature?: TemperatureId | null;
  partyType?: PartyId | null;
  specialRequest?: string | null;
  guestEmail?: string | null;
};

export type PreferenceRecord = {
  id?: string;
  scent?: string | null;
  pillow_firmness?: string | null;
  lighting?: string | null;
  temperature?: string | null;
  party_type?: string | null;
  special_request?: string | null;
};

function labelOf<T extends { id: string; ko: string }>(
  options: readonly T[],
  id: string | null | undefined,
): string | null {
  if (!id) return null;
  return options.find((option) => option.id === id)?.ko ?? id;
}

export function preferenceKoLabels(pref: PreferenceRecord) {
  return {
    scent: labelOf(SCENT_OPTIONS, pref.scent),
    pillow: labelOf(PILLOW_OPTIONS, pref.pillow_firmness),
    lighting: labelOf(LIGHTING_OPTIONS, pref.lighting),
    temperature: labelOf(TEMPERATURE_OPTIONS, pref.temperature),
    party: labelOf(PARTY_OPTIONS, pref.party_type),
  };
}

export function isPartyType(
  value: string | null | undefined,
): value is PartyId {
  return PARTY_OPTIONS.some((option) => option.id === value);
}

export function buildSetupTelegramMessage(input: {
  roomNumber: string;
  preference: PreferenceRecord;
  updated?: boolean;
}): string {
  const labels = preferenceKoLabels(input.preference);
  const lines = [
    input.updated
      ? `🛏 객실 세팅 변경 · Room ${input.roomNumber}`
      : `🛏 객실 세팅 요청 · Room ${input.roomNumber}`,
    "",
  ];
  if (labels.scent) lines.push(`향: ${labels.scent}`);
  if (labels.pillow) lines.push(`베개: ${labels.pillow}`);
  if (labels.lighting) lines.push(`조명: ${labels.lighting}`);
  if (labels.temperature) lines.push(`온도: ${labels.temperature}`);
  if (labels.party) lines.push(`동행: ${labels.party}`);
  const memo = input.preference.special_request?.trim();
  if (memo) {
    lines.push("");
    lines.push(`메모: ${memo}`);
  }
  lines.push("");
  lines.push("체크인 전까지 준비 부탁드립니다.");
  return lines.join("\n");
}
