import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import { fetchRoomByNumber } from "@/lib/rooms";
import {
  buildSetupTelegramMessage,
  isPartyType,
  type PreferencePayload,
} from "@/lib/preferenceOptions";

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

const PREF_COLUMNS =
  "id, stay_id, room_id, scent, pillow_firmness, lighting, temperature, party_type, special_request, submitted_at";

async function findPreferenceForRoom(roomId: string) {
  const { data: currentStay } = await supabase
    .from("stays")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "current")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (currentStay?.id) {
    const { data } = await supabase
      .from("preferences")
      .select(PREF_COLUMNS)
      .eq("stay_id", currentStay.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }

  const { data: upcomingStay } = await supabase
    .from("stays")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "upcoming")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (upcomingStay?.id) {
    const { data } = await supabase
      .from("preferences")
      .select(PREF_COLUMNS)
      .eq("stay_id", upcomingStay.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }

  const { data: roomPref } = await supabase
    .from("preferences")
    .select(PREF_COLUMNS)
    .eq("room_id", roomId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return roomPref ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomNumber = cleanText(searchParams.get("room"));
  const roomIdParam = cleanText(searchParams.get("roomId"));
  const email = cleanText(searchParams.get("email"));

  if (roomNumber || roomIdParam) {
    let roomId = roomIdParam;
    if (!roomId && roomNumber) {
      const { room } = await fetchRoomByNumber(roomNumber);
      roomId = room?.id ?? null;
    }
    if (!roomId) {
      return NextResponse.json({ preference: null });
    }
    const preference = await findPreferenceForRoom(roomId);
    return NextResponse.json({ preference });
  }

  if (!email) {
    return NextResponse.json({ preference: null });
  }

  const { data: stays, error: stayError } = await supabase
    .from("stays")
    .select("id")
    .ilike("guest_email", email)
    .order("created_at", { ascending: false });

  if (stayError || !stays?.length) {
    return NextResponse.json({ preference: null });
  }

  const { data: prefs, error: prefError } = await supabase
    .from("preferences")
    .select(PREF_COLUMNS)
    .in(
      "stay_id",
      stays.map((stay) => stay.id),
    )
    .order("submitted_at", { ascending: false })
    .limit(1);

  if (prefError || !prefs?.[0]) {
    return NextResponse.json({ preference: null });
  }

  return NextResponse.json({ preference: prefs[0] });
}

export async function POST(request: Request) {
  let body: PreferencePayload;
  try {
    body = (await request.json()) as PreferencePayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const roomNumber = cleanText(body.roomNumber);
  if (!roomNumber) {
    return NextResponse.json({ error: "room_required" }, { status: 400 });
  }

  const { room } = await fetchRoomByNumber(roomNumber);
  if (!room?.id) {
    return NextResponse.json({ error: "room_not_found" }, { status: 404 });
  }

  const guestEmail = cleanText(body.guestEmail)?.toLowerCase() ?? null;
  const specialRequest = cleanText(body.specialRequest);
  const partyType = isPartyType(body.partyType) ? body.partyType : null;
  const requestedStayId = cleanText(body.stayId);

  let stayId: string | null = requestedStayId;

  const { data: currentStay } = requestedStayId
    ? { data: null }
    : await supabase
        .from("stays")
        .select("id")
        .eq("room_id", room.id)
        .eq("status", "current")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  const { data: upcomingStay } = requestedStayId || currentStay?.id
    ? { data: null }
    : await supabase
        .from("stays")
        .select("id")
        .eq("room_id", room.id)
        .eq("status", "upcoming")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  const existingStayId = requestedStayId
    ? requestedStayId
    : currentStay?.id
      ? String(currentStay.id)
      : upcomingStay?.id
        ? String(upcomingStay.id)
        : null;

  if (existingStayId) {
    stayId = existingStayId;
    const stayPatch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (guestEmail) stayPatch.guest_email = guestEmail;
    if (partyType) stayPatch.party_type = partyType;
    if (guestEmail || partyType) {
      await supabase.from("stays").update(stayPatch).eq("id", stayId);
    }
  } else if (guestEmail || partyType) {
    const { data: created } = await supabase
      .from("stays")
      .insert({
        room_id: room.id,
        guest_email: guestEmail,
        party_type: partyType,
        status: "upcoming",
      })
      .select("id")
      .single();
    stayId = created?.id ? String(created.id) : null;
  }

  const prefValues = {
    stay_id: stayId,
    room_id: room.id,
    scent: body.scent || null,
    pillow_firmness: body.pillowFirmness || null,
    lighting: body.lighting || null,
    party_type: partyType,
    temperature: body.temperature || null,
    special_request: specialRequest,
  };

  let existingId = cleanText(body.preferenceId);
  if (!existingId && stayId) {
    const { data: stayPref } = await supabase
      .from("preferences")
      .select("id")
      .eq("stay_id", stayId)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    existingId = stayPref?.id ? String(stayPref.id) : null;
  }
  if (!existingId && !requestedStayId) {
    const existing = await findPreferenceForRoom(room.id);
    existingId = existing?.id ? String(existing.id) : null;
  }

  const updated = Boolean(existingId);
  const write = existingId
    ? await supabase
        .from("preferences")
        .update({ ...prefValues, submitted_at: new Date().toISOString() })
        .eq("id", existingId)
    : await supabase.from("preferences").insert(prefValues);

  if (write.error) {
    return NextResponse.json({ error: write.error.message }, { status: 500 });
  }

  const telegram = await sendTelegramMessage(
    buildSetupTelegramMessage({
      roomNumber: room.roomNumber,
      updated,
      preference: {
        scent: body.scent || null,
        pillow_firmness: body.pillowFirmness || null,
        lighting: body.lighting || null,
        temperature: body.temperature || null,
        party_type: partyType,
        special_request: specialRequest,
      },
    }),
  );

  return NextResponse.json({
    ok: true,
    updated,
    telegram: telegram.ok,
    telegramError: telegram.error ?? null,
  });
}
