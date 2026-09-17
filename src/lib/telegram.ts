const TELEGRAM_API = "https://api.telegram.org";

export function telegramShortId(id: string | number): string {
  return String(id).slice(0, 8);
}

export type TelegramSendResult = {
  ok: boolean;
  error?: string;
};

export async function telegramApi<T = unknown>(
  method: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; result?: T; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN 없음" };

  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return (await response.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
  };
}

export function orderInlineKeyboard(shortId: string) {
  return {
    inline_keyboard: [
      [
        { text: "✅ 확인", callback_data: `confirm_${shortId}` },
        { text: "✅ 완료", callback_data: `done_${shortId}` },
      ],
    ],
  };
}

export async function sendTelegramMessage(
  text: string,
  options?: {
    chatId?: string | number;
    replyMarkup?: unknown;
  },
): Promise<TelegramSendResult> {
  const chatId = options?.chatId ?? process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return { ok: false, error: "TELEGRAM_CHAT_ID 없음" };

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
  };
  if (options?.replyMarkup) {
    payload.reply_markup = options.replyMarkup;
  }

  const result = await telegramApi("sendMessage", payload);
  if (!result.ok) {
    return { ok: false, error: result.description ?? "sendMessage 실패" };
  }
  return { ok: true };
}

export function appendEntityTags(
  message: string,
  ids: { orderId?: string; requestIds?: string[] },
): string {
  const tags: string[] = [];
  if (ids.orderId) tags.push(`#order_${telegramShortId(ids.orderId)}`);
  for (const requestId of ids.requestIds ?? []) {
    tags.push(`#req_${telegramShortId(requestId)}`);
  }
  if (tags.length === 0) return message;
  return `${message.trimEnd()}\n\n${tags.join("\n")}`;
}
