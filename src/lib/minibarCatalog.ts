import { supabase } from "@/lib/supabase";

const CATEGORY_ALIASES: Record<string, string> = {
  snack: "Snack",
  "soft drink": "Soft Drink",
  softdrink: "Soft Drink",
  whisky: "Whisky",
  whiskey: "Whisky",
  wine: "Wine",
  soju: "Soju",
  highball: "Highball",
};

export const CATEGORY_PLACEHOLDER_EMOJI: Record<string, string> = {
  Snack: "🍪",
  "Soft Drink": "🥤",
  Whisky: "🥃",
  Wine: "🍷",
  Soju: "🍶",
  Highball: "🍹",
};

export function normalizeCategory(raw: string | null | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  return CATEGORY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

export function categoryPlaceholderEmoji(category: string): string {
  return CATEGORY_PLACEHOLDER_EMOJI[normalizeCategory(category)] ?? "🛒";
}

export function isRemoteImageUrl(url: string | null | undefined): boolean {
  return !!url && /^https?:\/\//i.test(url.trim());
}

export const ALCOHOL_CATEGORIES = ["whisky", "wine", "soju", "highball"] as const;

export function isAlcoholCategory(category: string): boolean {
  const key = normalizeCategory(category).trim().toLowerCase();
  return (ALCOHOL_CATEGORIES as readonly string[]).includes(key);
}

export type InventoryRow = {
  id: string | number;
  name: string;
  category: string;
  qty: number;
  available?: boolean | null;
  price?: number | string | null;
  image_url?: string | null;
  room_id?: string | null;
};

export type LiveMinibarItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
};

export function mapInventoryToMinibarItem(row: InventoryRow): LiveMinibarItem {
  const qty = Number(row.qty) || 0;
  const imageUrl = (row.image_url ?? "").trim();
  const category = normalizeCategory(row.category);
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    category,
    price: Number(row.price) || 0,
    image: isRemoteImageUrl(imageUrl) ? imageUrl : "",
    available: row.available === false ? false : qty > 0,
  };
}

export async function fetchGuestInventory(roomNumber: string): Promise<{
  rows: InventoryRow[];
  roomId: string | null;
  error: string | null;
}> {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id")
    .eq("room_number", roomNumber)
    .maybeSingle();

  if (roomError) {
    console.error("[minibar] rooms lookup failed", roomError.message, {
      roomNumber,
    });
  }

  const roomId =
    room && typeof room.id === "string" && room.id.includes("-")
      ? room.id
      : null;

  let query = supabase.from("inventory").select("*").order("category");
  if (roomId) {
    query = supabase
      .from("inventory")
      .select("*")
      .or(`room_id.eq.${roomId},room_id.is.null`)
      .order("category");
  }

  const { data, error } = await query;
  const rows = (data ?? []) as InventoryRow[];
  console.log("minibar raw:", data, "error:", error);

  if (!error && rows.length) {
    return { rows, roomId, error: null };
  }

  if (error) {
    console.error("[minibar] inventory query failed", error.message, {
      roomNumber,
      roomId,
    });
  }

  const fallback = await supabase.from("inventory").select("*").order("category");
  const fallbackRows = (fallback.data ?? []) as InventoryRow[];
  console.log("minibar fallback:", fallback.data, "error:", fallback.error);

  if (fallback.error && fallbackRows.length === 0) {
    return {
      rows: [],
      roomId,
      error: fallback.error.message || error?.message || "load failed",
    };
  }

  return {
    rows: fallbackRows,
    roomId,
    error: null,
  };
}
