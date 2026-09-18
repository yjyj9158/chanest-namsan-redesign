"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "./_components/AdminNav";
import { OrdersPanel } from "./_components/OrdersPanel";
import { InventoryPanel } from "./_components/InventoryPanel";
import { RequestsPanel } from "./_components/RequestsPanel";
import { StatsPanel } from "./_components/StatsPanel";
import { SummaryBar } from "./_components/SummaryBar";
import { RoomResetControl } from "./_components/RoomResetControl";
import { RoomFilter } from "./_components/RoomFilter";
import { PrepPanel } from "./_components/PrepPanel";
import { AdminProvider, useAdmin } from "./_context/AdminContext";
import type { AdminTab } from "./_data/mock";

function AdminShell() {
  const [tab, setTab] = useState<AdminTab>("orders");
  const {
    unreadOrders,
    unreadRequests,
    markOrdersSeen,
    markRequestsSeen,
  } = useAdmin();

  useEffect(() => {
    if (tab === "orders") markOrdersSeen();
    if (tab === "requests") markRequestsSeen();
  }, [tab, markOrdersSeen, markRequestsSeen]);

  return (
    <div className="min-h-svh">
      <AdminNav
        active={tab}
        onChange={setTab}
        counts={{
          orders: unreadOrders,
          requests: unreadRequests,
        }}
      />

      <main className="md:pl-56">
        <div className="mx-auto max-w-3xl px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:px-8 md:py-10 md:pb-10">
          <div className="mb-6 space-y-3">
            <SummaryBar />
            <RoomResetControl />
            {tab !== "prep" ? <RoomFilter /> : null}
          </div>

          {tab === "orders" && <OrdersPanel />}
          {tab === "prep" && <PrepPanel />}
          {tab === "inventory" && <InventoryPanel />}
          {tab === "requests" && <RequestsPanel />}
          {tab === "stats" && <StatsPanel />}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminShell />
    </AdminProvider>
  );
}
