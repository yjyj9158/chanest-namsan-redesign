import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { InventoryRow } from "@/lib/minibarCatalog";

type ChangeEvent = "INSERT" | "UPDATE" | "DELETE";

export function subscribeTableChanges<T extends Record<string, unknown>>(
  baseName: string,
  table: string,
  events: ChangeEvent[],
  onRow: (event: ChangeEvent, row: T) => void,
): () => void {
  const channel = supabase.channel(baseName);

  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table },
    (payload) => {
      const event = payload.eventType as ChangeEvent;
      if (!events.includes(event)) return;
      const row = (event === "DELETE" ? payload.old : payload.new) as T | null;
      if (!row || typeof row !== "object") return;
      onRow(event, row);
    },
  );

  channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

const INVENTORY_SYNC = "inventory-sync";
const PUBLIC_BROADCAST = { config: { broadcast: { ack: false }, private: false } } as const;

export function subscribeInventoryBroadcast(
  onRow: (row: Pick<InventoryRow, "id" | "qty"> & Partial<InventoryRow>) => void,
): () => void {
  const channel = supabase
    .channel(INVENTORY_SYNC, PUBLIC_BROADCAST)
    .on("broadcast", { event: "update" }, ({ payload }) => {
      if (!payload || typeof payload !== "object") return;
      const row = payload as Pick<InventoryRow, "id" | "qty"> &
        Partial<InventoryRow>;
      if (row.id == null || row.qty == null) return;
      onRow(row);
    })
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function broadcastInventoryUpdate(
  row: Pick<InventoryRow, "id" | "qty"> & Partial<InventoryRow>,
) {
  const channel: RealtimeChannel = supabase.channel(
    INVENTORY_SYNC,
    PUBLIC_BROADCAST,
  );
  await channel.send({
    type: "broadcast",
    event: "update",
    payload: row,
  });
}

const REQUESTS_SYNC = "requests-sync";

export type RequestSyncRow = {
  id: string | number;
  room: string;
  message: string;
  type: string;
  status: string;
  reply: string | null;
  created_at: string;
};

export function subscribeRequestsBroadcast(
  onRow: (row: RequestSyncRow) => void,
): () => void {
  const channel = supabase
    .channel(REQUESTS_SYNC, PUBLIC_BROADCAST)
    .on("broadcast", { event: "update" }, ({ payload }) => {
      if (!payload || typeof payload !== "object") return;
      const row = payload as RequestSyncRow;
      if (row.id == null) return;
      onRow(row);
    })
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function broadcastRequestUpdate(row: RequestSyncRow) {
  const channel: RealtimeChannel = supabase.channel(
    REQUESTS_SYNC,
    PUBLIC_BROADCAST,
  );
  await channel.send({
    type: "broadcast",
    event: "update",
    payload: row,
  });
}
