import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  closeStayOrdersAndRequests,
  sendStayCheckoutSummary,
} from "@/lib/checkoutSummary";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "stay_required" }, { status: 400 });
  }

  const { data: stay, error } = await supabase
    .from("stays")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!stay) {
    return NextResponse.json({ error: "stay_not_found" }, { status: 404 });
  }

  if (stay.status !== "completed") {
    const { error: updateError } = await supabase
      .from("stays")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  await closeStayOrdersAndRequests(id);

  try {
    const summary = await sendStayCheckoutSummary(id);
    return NextResponse.json({
      ok: true,
      stayId: id,
      sent: summary.sent,
      total: summary.total,
      error: summary.error,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: true,
        stayId: id,
        sent: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
