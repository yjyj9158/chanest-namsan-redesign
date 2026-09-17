import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleTelegramUpdate } from "@/lib/telegramWebhook";

export const dynamic = "force-dynamic";

export async function GET() {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_CHAT_ID 이 없습니다." },
      { status: 500 },
    );
  }

  const { data: latestRequest, error: requestError } = await supabase
    .from("requests")
    .select("id, room, message, status, reply")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (requestError) {
    return NextResponse.json(
      { ok: false, error: requestError.message },
      { status: 500 },
    );
  }

  if (!latestRequest) {
    return NextResponse.json(
      { ok: false, error: "테스트할 문의가 없습니다." },
      { status: 404 },
    );
  }

  const prefix = String(latestRequest.id).slice(0, 8);
  const fakeUpdate = {
    message: {
      from: { id: parseInt(chatId, 10) },
      chat: { id: parseInt(chatId, 10) },
      text: "테스트 답장입니다",
      reply_to_message: {
        text: `💬 새 문의 · Room ${latestRequest.room ?? ""}\n"${latestRequest.message ?? ""}"\n\n#req_${prefix}`,
      },
    },
  };

  const result = await handleTelegramUpdate(fakeUpdate);

  const { data: updated } = await supabase
    .from("requests")
    .select("id, room, message, status, reply")
    .eq("id", latestRequest.id)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    result,
    before: latestRequest,
    after: updated,
  });
}
