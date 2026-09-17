import { NextResponse } from "next/server";
import { hotelData, formatKRW } from "@/data/hotelData";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

type OrderItem = { name?: string; qty?: number; price?: number };

type OrderRow = {
  id?: string;
  room?: string;
  items?: unknown;
  total?: number | string | null;
  type?: string | null;
  note?: string | null;
  status?: string | null;
};

type RequestRow = {
  id?: string;
  room?: string;
  message?: string | null;
  type?: string | null;
  status?: string | null;
};

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const auth = request.headers.get("authorization");
  const isCron = request.headers.get("x-vercel-cron") === "1";
  if (isCron || auth) {
    return auth === `Bearer ${secret}`;
  }
  return true;
}

function parseItems(raw: unknown): OrderItem[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return parseItems(JSON.parse(raw));
    } catch {
      return raw.trim() ? [{ name: raw.trim(), qty: 1, price: 0 }] : [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    if (typeof entry === "string") return { name: entry, qty: 1, price: 0 };
    const item = entry as OrderItem;
    return {
      name: item.name ?? "",
      qty: Number(item.qty) || 1,
      price: Number(item.price) || 0,
    };
  });
}

function buildMessage(
  room: string,
  minibar: { name: string; qty: number; amount: number }[],
  amenities: string[],
  questionCount: number,
  answeredCount: number,
): string {
  const hasAnything =
    minibar.length > 0 || amenities.length > 0 || questionCount > 0;
  if (!hasAnything) {
    return `📋 Room ${room} — 이용 내역 없음`;
  }

  const lines: string[] = [`📋 Room ${room} 체크아웃 정산`, ""];
  const minibarTotal = minibar.reduce((sum, row) => sum + row.amount, 0);

  if (minibar.length > 0) {
    lines.push("■ 미니바");
    for (const row of minibar) {
      lines.push(`- ${row.name} ×${row.qty}  ${formatKRW(row.amount)}`);
    }
    lines.push(`소계: ${formatKRW(minibarTotal)}`);
    lines.push("");
  }

  if (amenities.length > 0) {
    lines.push("■ 객실 요청");
    for (const line of amenities) {
      lines.push(`- ${line}`);
    }
    lines.push("");
  }

  if (questionCount > 0) {
    lines.push(`■ 문의 ${questionCount}건 (답변완료 ${answeredCount}건)`);
    lines.push("");
  }

  lines.push("━━━━━━━━━━━━━━━");
  lines.push(`총 정산 금액: ${formatKRW(minibarTotal)}`);
  lines.push("━━━━━━━━━━━━━━━");
  return lines.join("\n");
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = hotelData.room;

  try {
    const [ordersRes, requestsRes] = await Promise.all([
      supabase.from("orders").select("*").eq("room", room),
      supabase.from("requests").select("*").eq("room", room),
    ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (requestsRes.error) throw new Error(requestsRes.error.message);

    const orders = (ordersRes.data ?? []) as OrderRow[];
    const requests = (requestsRes.data ?? []) as RequestRow[];

    const minibarMap = new Map<string, { qty: number; amount: number }>();
    const amenities: string[] = [];

    for (const order of orders) {
      const items = parseItems(order.items);
      for (const item of items) {
        const name = item.name?.trim();
        if (!name) continue;
        const qty = item.qty ?? 1;
        const amount = (item.price ?? 0) * qty;
        if (amount > 0) {
          const current = minibarMap.get(name) ?? { qty: 0, amount: 0 };
          minibarMap.set(name, {
            qty: current.qty + qty,
            amount: current.amount + amount,
          });
        } else {
          amenities.push(`${name}${qty > 1 ? ` ×${qty}` : ""} (무료)`);
        }
      }
    }

    let questionCount = 0;
    let answeredCount = 0;
    for (const row of requests) {
      if (row.type === "question") {
        questionCount += 1;
        if (row.status === "answered") answeredCount += 1;
      } else {
        const message = row.message?.trim();
        if (!message) continue;
        for (const part of message.split(/,\s*/).filter(Boolean)) {
          amenities.push(`${part} (무료)`);
        }
      }
    }

    const minibar = [...minibarMap.entries()].map(([name, value]) => ({
      name,
      qty: value.qty,
      amount: value.amount,
    }));
    const total = minibar.reduce((sum, row) => sum + row.amount, 0);
    const text = buildMessage(
      room,
      minibar,
      amenities,
      questionCount,
      answeredCount,
    );

    const sent = await sendTelegramMessage(text);

    return NextResponse.json({
      sent: sent.ok,
      total,
      orderCount: orders.length,
      error: sent.ok ? undefined : sent.error,
    });
  } catch (err) {
    return NextResponse.json(
      {
        sent: false,
        total: 0,
        orderCount: 0,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
