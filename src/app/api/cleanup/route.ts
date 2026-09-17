import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function deleteAll(table: "orders" | "requests"): Promise<number> {
  const { data, error: selectError } = await supabase.from(table).select("id");
  if (selectError) throw new Error(`${table}: ${selectError.message}`);

  const ids = (data ?? []).map((row) => row.id);
  if (ids.length === 0) return 0;

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .in("id", ids);
  if (deleteError) throw new Error(`${table}: ${deleteError.message}`);

  return ids.length;
}

export async function GET() {
  try {
    const [orders_deleted, requests_deleted] = await Promise.all([
      deleteAll("orders"),
      deleteAll("requests"),
    ]);

    return NextResponse.json({ orders_deleted, requests_deleted });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
