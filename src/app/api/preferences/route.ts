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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = cleanText(searchParams.get("email"));
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
    .select(
      "scent, pillow_firmness, lighting, temperature, party_type, special_request, submitted_at",
    )
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

  let stayId: string | null = null;

  const { data: currentStay } = await supabase
    .from("stays")
    .select("id")
    .eq("room_id", room.id)
    .eq("status", "current")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: upcomingStay } =
    currentStay?.id
      ? { data: null }
      : await supabase
          .from("stays")
          .select("id")
          .eq("room_id", room.id)
          .eq("status", "upcoming")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

  const existingStayId = currentStay?.id
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

  const { error: insertError } = await supabase.from("preferences").insert({
    stay_id: stayId,
    room_id: room.id,
    scent: body.scent || null,
    pillow_firmness: body.pillowFirmness || null,
    lighting: body.lighting || null,
    party_type: partyType,
    temperature: body.temperature || null,
    special_request: specialRequest,
  });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 },
    );
  }

  const telegram = await sendTelegramMessage(
    buildSetupTelegramMessage({
      roomNumber: room.roomNumber,
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
    telegram: telegram.ok,
    telegramError: telegram.error ?? null,
  });
}
