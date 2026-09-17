import { NextResponse } from "next/server";
import {
  appendEntityTags,
  orderInlineKeyboard,
  sendTelegramMessage,
  telegramShortId,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: string;
      text?: string;
      orderId?: string;
      requestId?: string;
      requestIds?: string[];
    };
    const text = (body.message ?? body.text ?? "").trim();
    if (!text) {
      return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });
    }

    const requestIds = [
      ...(body.requestIds ?? []),
      ...(body.requestId ? [body.requestId] : []),
    ].filter((id, index, all) => all.indexOf(id) === index);

    const tagged = appendEntityTags(text, {
      orderId: body.orderId,
      requestIds,
    });

    const buttonId = body.orderId;
    const replyMarkup = buttonId
      ? orderInlineKeyboard(telegramShortId(buttonId))
      : undefined;

    const sent = await sendTelegramMessage(tagged, { replyMarkup });
    if (!sent.ok) {
      return NextResponse.json(
        { ok: false, error: sent.error ?? "telegram send failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
