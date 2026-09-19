import { formatKRW } from "@/data/hotelData";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import { seoulDateString, stayStatusFromDates } from "@/lib/stayDates";

export type OrderItem = { name?: string; qty?: number; price?: number };

export type OrderRow = {
  id?: string;
  room?: string;
  stay_id?: string | null;
  items?: unknown;
  total?: number | string | null;
  type?: string | null;
  note?: string | null;
  status?: string | null;
};

export type RequestRow = {
  id?: string;
  room?: string;
  stay_id?: string | null;
  message?: string | null;
  type?: string | null;
  status?: string | null;
};

export function parseItems(raw: unknown): OrderItem[] {
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

export function buildCheckoutMessage(
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

export function aggregateCheckout(
  room: string,
  orders: OrderRow[],
  requests: RequestRow[],
) {
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
  const text = buildCheckoutMessage(
    room,
    minibar,
    amenities,
    questionCount,
    answeredCount,
  );

  return { minibar, amenities, questionCount, answeredCount, total, text };
}

export async function loadStayCheckoutSource(stayId: string) {
  const { data: stay, error: stayError } = await supabase
    .from("stays")
    .select("id, room_id, status, guest_name")
    .eq("id", stayId)
    .maybeSingle();
  if (stayError) throw new Error(stayError.message);
  if (!stay) throw new Error("stay_not_found");

  let roomNumber = "";
  if (stay.room_id) {
    const { data: room } = await supabase
      .from("rooms")
      .select("room_number")
      .eq("id", stay.room_id)
      .maybeSingle();
    roomNumber = room?.room_number ? String(room.room_number) : "";
  }

  const [ordersRes, requestsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("stay_id", stayId),
    supabase.from("requests").select("*").eq("stay_id", stayId),
  ]);
  if (ordersRes.error) throw new Error(ordersRes.error.message);
  if (requestsRes.error) throw new Error(requestsRes.error.message);

  return {
    stay,
    roomNumber,
    orders: (ordersRes.data ?? []) as OrderRow[],
    requests: (requestsRes.data ?? []) as RequestRow[],
  };
}

export async function sendStayCheckoutSummary(stayId: string) {
  const source = await loadStayCheckoutSource(stayId);
  const room = source.roomNumber || "—";
  const summary = aggregateCheckout(room, source.orders, source.requests);
  const sent = await sendTelegramMessage(summary.text);
  return {
    ...summary,
    sent: sent.ok,
    error: sent.ok ? undefined : sent.error,
    orderCount: source.orders.length,
    room,
  };
}

export async function closeStayOrdersAndRequests(stayId: string) {
  const now = new Date().toISOString();
  await Promise.all([
    supabase
      .from("orders")
      .update({ status: "done", updated_at: now })
      .eq("stay_id", stayId)
      .neq("status", "done"),
    supabase
      .from("requests")
      .update({ status: "answered", updated_at: now })
      .eq("stay_id", stayId)
      .neq("status", "answered"),
  ]);
}

export async function transitionStayStatuses(today = seoulDateString()) {
  const activated: string[] = [];
  const completed: string[] = [];

  const { data: upcoming } = await supabase
    .from("stays")
    .select("id, check_in, check_out, status")
    .eq("status", "upcoming");

  for (const stay of upcoming ?? []) {
    const next = stayStatusFromDates(stay.check_in, stay.check_out, today);
    if (next !== "current") continue;
    const { error } = await supabase
      .from("stays")
      .update({ status: "current", updated_at: new Date().toISOString() })
      .eq("id", stay.id)
      .eq("status", "upcoming");
    if (!error) activated.push(String(stay.id));
  }

  const { data: current } = await supabase
    .from("stays")
    .select("id, check_out, status")
    .eq("status", "current");

  for (const stay of current ?? []) {
    if (!stay.check_out || stay.check_out >= today) continue;
    const { error } = await supabase
      .from("stays")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", stay.id)
      .eq("status", "current");
    if (error) continue;
    await closeStayOrdersAndRequests(String(stay.id));
    completed.push(String(stay.id));
  }

  return { activated, completed };
}
