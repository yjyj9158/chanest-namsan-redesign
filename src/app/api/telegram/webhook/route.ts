import { NextResponse } from "next/server";
import { handleTelegramUpdate } from "@/lib/telegramWebhook";

export const dynamic = "force-dynamic";

function secretFrom(request: Request): string | null {
  const url = new URL(request.url);
  return url.searchParams.get("secret");
}

export async function POST(request: Request) {
  const expected = process.env.WEBHOOK_SECRET;
  const provided = secretFrom(request);
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  try {
    const update = await request.json();
    const result = await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[telegram webhook]", err);
    return NextResponse.json({ ok: true, error: "handled" });
  }
}
