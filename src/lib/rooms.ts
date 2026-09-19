import { hotelData } from "@/data/hotelData";
import { supabase } from "@/lib/supabase";

export const DEFAULT_ROOM_NUMBER = "301";

export type RoomRow = {
  id: string;
  room_number: string;
  name: string;
  name_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  capacity?: number | null;
  is_active?: boolean | null;
  wifi_ssid?: string | null;
  wifi_password?: string | null;
  door_code?: string | null;
  checkout_time?: string | null;
  hero_image?: string | null;
};

export type RoomInfo = {
  id: string | null;
  roomNumber: string;
  name: string;
  nameEn: string;
  description: string | null;
  descriptionEn: string | null;
  wifiSsid: string;
  wifiPassword: string;
  doorCode: string;
  checkoutTime: string;
  heroImage: string | null;
  capacity: number;
  isActive: boolean;
};

export type StayRow = {
  id: string;
  room_id: string | null;
  check_in: string | null;
  check_out: string | null;
  guest_name: string | null;
  guest_email: string | null;
  party_type: string | null;
  status: "upcoming" | "current" | "completed" | string;
  created_at?: string;
  updated_at?: string | null;
};

export function parseRoomNumberFromPath(pathname: string): string {
  const match = pathname.match(/\/r\/([^/]+)/);
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }
  return DEFAULT_ROOM_NUMBER;
}

export function fallbackRoom(roomNumber = DEFAULT_ROOM_NUMBER): RoomInfo {
  const isDefault = roomNumber === DEFAULT_ROOM_NUMBER;
  return {
    id: null,
    roomNumber,
    name: isDefault ? "더 채네스트 남산 301" : `Room ${roomNumber}`,
    nameEn: isDefault ? "The Chanest Namsan 301" : `Room ${roomNumber}`,
    description: isDefault
      ? "남산 곁의 고요한 스위트. 빛, 향, 침구까지 머무는 시간을 위해 다시 그렸습니다."
      : null,
    descriptionEn: isDefault
      ? "A quiet suite beside Namsan. Light, scent, and bedding — redrawn for the hours you stay."
      : null,
    wifiSsid: hotelData.wifi.network,
    wifiPassword: hotelData.wifi.password,
    doorCode: hotelData.doorLockPassword,
    checkoutTime: "11:00",
    heroImage: null,
    capacity: 2,
    isActive: true,
  };
}

export function mergeRoom(row: RoomRow): RoomInfo {
  const fb = fallbackRoom(row.room_number);
  return {
    id: row.id,
    roomNumber: row.room_number,
    name: row.name || fb.name,
    nameEn: row.name_en || fb.nameEn,
    description: row.description || fb.description,
    descriptionEn: row.description_en || fb.descriptionEn,
    wifiSsid: row.wifi_ssid || fb.wifiSsid,
    wifiPassword: row.wifi_password || fb.wifiPassword,
    doorCode: row.door_code || fb.doorCode,
    checkoutTime: row.checkout_time || fb.checkoutTime,
    heroImage: row.hero_image || null,
    capacity: row.capacity ?? 2,
    isActive: row.is_active !== false,
  };
}

export async function fetchRoomByNumber(roomNumber: string): Promise<{
  room: RoomInfo | null;
  tableAvailable: boolean;
}> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_number", roomNumber)
    .maybeSingle();

  if (error) {
    return {
      room: roomNumber === DEFAULT_ROOM_NUMBER ? fallbackRoom() : null,
      tableAvailable: false,
    };
  }

  if (!data || data.is_active === false) {
    return { room: null, tableAvailable: true };
  }

  return { room: mergeRoom(data as RoomRow), tableAvailable: true };
}

export async function roomExists(roomNumber: string): Promise<boolean> {
  const { room } = await fetchRoomByNumber(roomNumber);
  return !!room;
}

export async function fetchActiveRooms(): Promise<RoomInfo[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("room_number");

  if (error || !data?.length) {
    return [fallbackRoom()];
  }

  return (data as RoomRow[]).map(mergeRoom);
}

export async function fetchCurrentStayId(
  roomId: string | null,
): Promise<string | null> {
  if (!roomId) return null;
  const { data, error } = await supabase
    .from("stays")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "current")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return String(data.id);
}

export function inventoryBelongsToRoom(
  row: { room_id?: string | null },
  roomId: string | null,
): boolean {
  if (!row.room_id) return true;
  if (!roomId) return true;
  return row.room_id === roomId;
}

export function rowMatchesRoomFilter(input: {
  room?: string | null;
  room_id?: string | null;
  selectedRoomId: string | "all";
  rooms: RoomRow[];
}): boolean {
  if (input.selectedRoomId === "all") return true;
  const selected = input.rooms.find((room) => room.id === input.selectedRoomId);
  if (!selected) return true;
  if (input.room_id && input.room_id === selected.id) return true;
  if (input.room && input.room === selected.room_number) return true;
  return false;
}

export function inventoryMatchesRoomFilter(input: {
  room_id?: string | null;
  selectedRoomId: string | "all";
}): boolean {
  if (input.selectedRoomId === "all") return true;
  if (!input.room_id) return true;
  return input.room_id === input.selectedRoomId;
}
