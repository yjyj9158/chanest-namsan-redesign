import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function cleanEmail(value: string | null): string | null {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

export async function GET(request: Request) {
  const email = cleanEmail(new URL(request.url).searchParams.get("email"));
  if (!email) {
    return NextResponse.json({ visitCount: 0, preference: null, stay: null });
  }

  const { data: stays, error } = await supabase
    .from("stays")
    .select("id, check_in, check_out, guest_name, party_type, status, created_at")
    .ilike("guest_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = stays ?? [];
  const visitCount = list.length;
  if (visitCount === 0) {
    return NextResponse.json({ visitCount: 0, preference: null, stay: null });
  }

  const stayIds = list.map((stay) => stay.id);
  const { data: prefs } = await supabase
    .from("preferences")
    .select(
      "id, stay_id, scent, pillow_firmness, lighting, temperature, party_type, special_request, submitted_at",
    )
    .in("stay_id", stayIds)
    .order("submitted_at", { ascending: false })
    .limit(1);

  return NextResponse.json({
    visitCount,
    stay: list[0],
    preference: prefs?.[0] ?? null,
  });
}
