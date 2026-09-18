import { supabase } from "@/lib/supabase";

export async function insertWithRoomIds(
  table: "orders" | "requests",
  payload: Record<string, unknown>,
  extras: { roomId?: string | null; stayId?: string | null },
) {
  const withIds: Record<string, unknown> = { ...payload };
  if (extras.roomId) withIds.room_id = extras.roomId;
  if (extras.stayId) withIds.stay_id = extras.stayId;

  const first = await supabase.from(table).insert(withIds).select("id").single();
  if (!first.error) return first;

  const message = first.error.message ?? "";
  const missingColumn =
    first.error.code === "PGRST204" ||
    message.includes("room_id") ||
    message.includes("stay_id");
  if (!missingColumn) return first;

  return supabase.from(table).insert(payload).select("id").single();
}
