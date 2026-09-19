import { NextResponse } from "next/server";
import { hotelData } from "@/data/hotelData";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import {
  aggregateCheckout,
  sendStayCheckoutSummary,
  transitionStayStatuses,
  type OrderRow,
  type RequestRow,
} from "@/lib/checkoutSummary";

export const dynamic = "force-dynamic";

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

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stayId = new URL(request.url).searchParams.get("stay_id")?.trim();

  try {
    if (stayId) {
      const result = await sendStayCheckoutSummary(stayId);
      return NextResponse.json({
        sent: result.sent,
        total: result.total,
        orderCount: result.orderCount,
        stayId,
        error: result.error,
      });
    }

    const isCron = request.headers.get("x-vercel-cron") === "1";
    if (isCron) {
      const transitioned = await transitionStayStatuses();
      const summaries = [];
      for (const id of transitioned.completed) {
        summaries.push(await sendStayCheckoutSummary(id));
      }
      if (transitioned.completed.length > 0) {
        return NextResponse.json({
          sent: summaries.every((row) => row.sent),
          activated: transitioned.activated.length,
          completed: transitioned.completed.length,
          total: summaries.reduce((sum, row) => sum + row.total, 0),
          orderCount: summaries.reduce((sum, row) => sum + row.orderCount, 0),
        });
      }
    }

    const room = hotelData.room;
    const [ordersRes, requestsRes] = await Promise.all([
      supabase.from("orders").select("*").eq("room", room),
      supabase.from("requests").select("*").eq("room", room),
    ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (requestsRes.error) throw new Error(requestsRes.error.message);

    const orders = (ordersRes.data ?? []) as OrderRow[];
    const requests = (requestsRes.data ?? []) as RequestRow[];
    const summary = aggregateCheckout(room, orders, requests);
    const sent = await sendTelegramMessage(summary.text);

    return NextResponse.json({
      sent: sent.ok,
      total: summary.total,
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
