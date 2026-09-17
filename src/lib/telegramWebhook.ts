import { supabase } from "@/lib/supabase";
import { broadcastRequestUpdate } from "@/lib/realtime";
import {
  sendTelegramMessage,
  telegramApi,
  telegramShortId,
} from "@/lib/telegram";

export type TelegramUpdate = {
  message?: {
    from?: { id: number };
    chat?: { id: number };
    text?: string;
    reply_to_message?: {
      text?: string;
      caption?: string;
    };
  };
  callback_query?: {
    id: string;
    from?: { id: number };
    data?: string;
    message?: {
      chat: { id: number };
      message_id: number;
    };
  };
};

type FoundRow = {
  id: string;
  room?: string | null;
};

function allowedChatId(id: number | undefined): boolean {
  const expected = Number(process.env.TELEGRAM_CHAT_ID);
  if (!Number.isFinite(expected) || id == null) return false;
  return id === expected;
}

function parseTags(text: string): { kind: "order" | "req"; prefix: string }[] {
  const tags: { kind: "order" | "req"; prefix: string }[] = [];
  const re = /#(order|req)_([0-9a-f]{8})/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    tags.push({
      kind: match[1].toLowerCase() === "order" ? "order" : "req",
      prefix: match[2].toLowerCase(),
    });
  }
  return tags;
}

async function findByPrefix(
  table: "orders" | "requests",
  prefix: string,
): Promise<FoundRow | null> {
  const { data, error } = await supabase
    .from(table)
    .select("id, room")
    .like("id", `${prefix}%`)
    .limit(1);

  if (!error && data?.[0]) {
    return { id: String(data[0].id), room: data[0].room };
  }

  const { data: recent } = await supabase
    .from(table)
    .select("id, room")
    .order("created_at", { ascending: false })
    .limit(80);

  const found = recent?.find((row) =>
    String(row.id).toLowerCase().startsWith(prefix.toLowerCase()),
  );
  return found ? { id: String(found.id), room: found.room } : null;
}

async function handleTextReply(update: TelegramUpdate): Promise<string> {
  const message = update.message;
  const replyText = message?.text?.trim();
  const source =
    message?.reply_to_message?.text ?? message?.reply_to_message?.caption ?? "";

  if (!message?.reply_to_message || !replyText) {
    return "ignored: not a reply";
  }
  if (!allowedChatId(message.from?.id) && !allowedChatId(message.chat?.id)) {
    return "ignored: unauthorized chat";
  }

  const tags = parseTags(source);
  if (tags.length === 0) {
    await sendTelegramMessage("⚠️ 해당 주문/문의를 찾지 못했습니다.");
    return "no tag";
  }

  const preview = replyText.slice(0, 30);
  const notes: string[] = [];

  for (const tag of tags) {
    if (tag.kind === "req") {
      const row = await findByPrefix("requests", tag.prefix);
      if (!row) {
        notes.push("request-not-found");
        continue;
      }
      const { error } = await supabase
        .from("requests")
        .update({
          reply: replyText,
          status: "answered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      if (error) {
        console.error("[telegram webhook] request update", error.message);
        notes.push("request-update-failed");
        continue;
      }
      const { data: full } = await supabase
        .from("requests")
        .select("id, room, message, type, status, reply, created_at")
        .eq("id", row.id)
        .maybeSingle();
      if (full) {
        void broadcastRequestUpdate({
          id: full.id,
          room: full.room,
          message: full.message,
          type: full.type,
          status: full.status,
          reply: full.reply,
          created_at: full.created_at,
        });
      }
      await sendTelegramMessage(
        `✅ Room ${row.room ?? ""} 문의에 답장 완료: ${preview}`.trim(),
      );
      notes.push(`request:${telegramShortId(row.id)}`);
    } else {
      const row = await findByPrefix("orders", tag.prefix);
      if (!row) {
        notes.push("order-not-found");
        continue;
      }
      const { error } = await supabase
        .from("orders")
        .update({
          status: "seen",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      if (error) {
        console.error("[telegram webhook] order update", error.message);
        notes.push("order-update-failed");
        continue;
      }
      await sendTelegramMessage(
        `✅ Room ${row.room ?? ""} 주문을 확인 처리했습니다.`.trim(),
      );
      notes.push(`order:${telegramShortId(row.id)}`);
    }
  }

  if (notes.every((n) => n.endsWith("not-found"))) {
    await sendTelegramMessage("⚠️ 해당 주문/문의를 찾지 못했습니다.");
  }

  return notes.join(",") || "ok";
}

async function handleCallback(update: TelegramUpdate): Promise<string> {
  const query = update.callback_query;
  if (!query?.data) return "ignored: no callback data";
  if (!allowedChatId(query.from?.id)) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: query.id,
      text: "권한이 없습니다.",
    });
    return "unauthorized";
  }

  const parsed = /^(confirm|done)_([0-9a-f]{8})$/i.exec(query.data);
  if (!parsed) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: query.id,
      text: "알 수 없는 버튼입니다.",
    });
    return "bad callback";
  }

  const action = parsed[1].toLowerCase();
  const prefix = parsed[2].toLowerCase();
  const row = await findByPrefix("orders", prefix);

  if (!row) {
    await telegramApi("answerCallbackQuery", {
      callback_query_id: query.id,
      text: "해당 주문을 찾지 못했습니다.",
    });
    return "order-not-found";
  }

  const status = action === "done" ? "done" : "seen";
  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (error) {
    console.error("[telegram webhook] callback update", error.message);
    await telegramApi("answerCallbackQuery", {
      callback_query_id: query.id,
      text: "처리에 실패했습니다.",
    });
    return "update-failed";
  }

  const text =
    action === "done" ? "주문 완료 처리됨" : "주문 확인 처리됨";
  await telegramApi("answerCallbackQuery", {
    callback_query_id: query.id,
    text,
  });

  if (query.message) {
    await telegramApi("editMessageReplyMarkup", {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: { inline_keyboard: [] },
    });
  }

  return `${status}:${telegramShortId(row.id)}`;
}

export async function handleTelegramUpdate(
  update: TelegramUpdate,
): Promise<string> {
  try {
    if (update.callback_query) return await handleCallback(update);
    if (update.message) return await handleTextReply(update);
    return "ignored: empty update";
  } catch (err) {
    console.error("[telegram webhook]", err);
    return err instanceof Error ? err.message : String(err);
  }
}
