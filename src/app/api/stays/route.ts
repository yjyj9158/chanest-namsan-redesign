import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { seoulDateString, stayStatusFromDates } from "@/lib/stayDates";
import { isPartyType } from "@/lib/preferenceOptions";

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .order("check_in", { ascending: false, nullsFirst: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ stays: data ?? [] });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const roomId = cleanText(body.roomId);
  if (!roomId) {
    return NextResponse.json({ error: "room_required" }, { status: 400 });
  }

  const checkIn = cleanText(body.checkIn);
  const checkOut = cleanText(body.checkOut);
  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "dates_required" }, { status: 400 });
  }
  if (checkOut < checkIn) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }

  const guestName = cleanText(body.guestName);
  const guestEmail = cleanText(body.guestEmail)?.toLowerCase() ?? null;
  const partyType = isPartyType(cleanText(body.partyType))
    ? cleanText(body.partyType)
    : null;
  const guestCount = Math.max(1, Number(body.guestCount) || 2);
  const status = stayStatusFromDates(checkIn, checkOut, seoulDateString());

  const payload: Record<string, unknown> = {
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    guest_name: guestName,
    guest_email: guestEmail,
    party_type: partyType,
    guest_count: guestCount,
    status,
    updated_at: new Date().toISOString(),
  };

  let write = await supabase.from("stays").insert(payload).select("*").single();
  if (write.error && /guest_count/i.test(write.error.message ?? "")) {
    delete payload.guest_count;
    write = await supabase.from("stays").insert(payload).select("*").single();
  }

  if (write.error) {
    return NextResponse.json({ error: write.error.message }, { status: 500 });
  }

  return NextResponse.json({ stay: write.data });
}
