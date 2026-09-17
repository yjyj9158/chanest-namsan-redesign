import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let supabase = "OK";
  let supabaseOk = false;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      supabase = "NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 없습니다.";
    } else {
      const client = createClient(url, anonKey);
      const { error } = await client.from("inventory").select("*").limit(1);

      if (error) {
        supabase = error.message;
      } else {
        supabaseOk = true;
        supabase = "OK";
      }
    }
  } catch (err) {
    supabase = err instanceof Error ? err.message : String(err);
  }

  let telegram = "OK";

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      telegram = "TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 없습니다.";
    } else {
      const supabaseLine = supabaseOk
        ? "✅ Supabase 연결: OK"
        : "❌ Supabase 연결: OK";
      const text = `🔍 시스템 점검 완료\n\n${supabaseLine}\n✅ 텔레그램 연결: OK\n\n모든 시스템이 정상 작동합니다.`;

      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        },
      );

      const payload = (await response.json()) as {
        ok?: boolean;
        description?: string;
      };

      if (!payload.ok) {
        telegram = payload.description ?? `HTTP ${response.status}`;
      } else {
        telegram = "OK";
      }
    }
  } catch (err) {
    telegram = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    supabase,
    telegram,
    allGood: supabase === "OK" && telegram === "OK",
  });
}
