import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { telegramApi } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  let secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    secret = randomUUID();
    console.log(
      `[telegram setup] WEBHOOK_SECRET 이 없습니다. .env.local 에 추가하세요:\nWEBHOOK_SECRET=${secret}`,
    );
    return NextResponse.json({
      ok: false,
      error: "WEBHOOK_SECRET 이 없습니다. 콘솔에 출력된 값을 .env.local 에 추가한 뒤 다시 호출하세요.",
      suggestedSecret: secret,
    });
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN 이 없습니다." },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;
  const webhookUrl = `${origin}/api/telegram/webhook?secret=${encodeURIComponent(secret)}`;

  const result = await telegramApi("setWebhook", { url: webhookUrl });

  return NextResponse.json({
    ok: Boolean(result.ok),
    webhookUrl,
    telegram: result,
    note:
      origin.includes("localhost") || origin.startsWith("http://")
        ? "텔레그램은 public HTTPS URL만 webhook으로 받습니다. 배포 후 이 라우트를 다시 호출하세요."
        : undefined,
  });
}
