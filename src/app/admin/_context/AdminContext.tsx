"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  broadcastInventoryUpdate,
  broadcastRequestUpdate,
  subscribeInventoryBroadcast,
  subscribeRequestsBroadcast,
  subscribeTableChanges,
} from "@/lib/realtime";
import { formatTimeAgo } from "@/lib/utils";
import {
  ADMIN_ROOM,
  formatKRWAmount,
  type MockInventoryItem,
  type MockOrder,
  type MockRequest,
  type OrderStatus,
  type RequestStatus,
  type RequestType,
} from "../_data/mock";

type AdminContextValue = {
  room: string;
  orders: MockOrder[];
  inventory: MockInventoryItem[];
  requests: MockRequest[];
  loading: boolean;
  inventoryError: string | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  updateInventoryQty: (id: string, delta: number) => void;
  addInventoryItem: (input: {
    name: string;
    category: string;
    price: number;
    qty: number;
  }) => Promise<boolean>;
  updateInventoryItem: (
    id: string,
    input: { name: string; category: string; price: number },
  ) => Promise<boolean>;
  deleteInventoryItem: (id: string) => Promise<boolean>;
  answerRequest: (id: string, reply: string) => void;
  resetRoom: () => Promise<void>;
  markOrdersSeen: () => void;
  markRequestsSeen: () => void;
  todayOrderCount: number;
  pendingCount: number;
  lowStockCount: number;
  unreadOrders: number;
  unreadRequests: number;
};

const AdminContext = createContext<AdminContextValue | null>(null);

type OrderItem = { name?: string; qty?: number; price?: number };

function formatOrderItems(items: unknown): string {
  if (!items) return "";
  if (typeof items === "string") return items;
  if (!Array.isArray(items)) return "";
  return items
    .map((raw) => {
      const item = raw as OrderItem | string;
      if (typeof item === "string") return item;
      const name = item.name ?? "";
      const qty = item.qty ?? 1;
      return `${name} ×${qty}`;
    })
    .filter(Boolean)
    .join(" · ");
}

function mapOrder(row: {
  id: string | number;
  room: string;
  items: unknown;
  total: number | string | null;
  status: string;
  created_at: string;
}): MockOrder {
  const amount = Number(row.total) || 0;
  const status: OrderStatus =
    row.status === "seen" || row.status === "done" ? row.status : "new";
  return {
    id: String(row.id),
    room: row.room,
    items: formatOrderItems(row.items),
    total: amount > 0 ? formatKRWAmount(amount) : "무료 요청",
    amount,
    timeAgo: formatTimeAgo(row.created_at),
    status,
    createdAt: row.created_at,
    unread: status === "new",
  };
}

function mapInventory(row: {
  id: string | number;
  name: string;
  category: string;
  qty: number;
  price?: number | string | null;
}): MockInventoryItem {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    qty: row.qty,
    price: Number(row.price) || 0,
  };
}

function mapRequest(row: {
  id: string | number;
  room: string;
  message: string;
  type: string;
  status: string;
  reply: string | null;
  created_at: string;
}): MockRequest {
  const type: RequestType =
    row.type === "order" || row.type === "amenity" ? row.type : "question";
  const status: RequestStatus =
    row.status === "answered" ? "answered" : "unanswered";
  return {
    id: String(row.id),
    room: row.room,
    message: row.message,
    timeAgo: formatTimeAgo(row.created_at),
    status,
    type,
    reply: row.reply ?? undefined,
    createdAt: row.created_at,
    unread: status === "unanswered",
  };
}

function getAudioContext(): AudioContext | null {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    return new Ctx();
  } catch {
    return null;
  }
}

function playBeep(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    /* ignore */
  }
}

function vibrateShort() {
  try {
    navigator.vibrate?.(80);
  } catch {
    /* ignore */
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [inventory, setInventory] = useState<MockInventoryItem[]>([]);
  const [requests, setRequests] = useState<MockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unlock = () => {
      if (!audioCtxRef.current) audioCtxRef.current = getAudioContext();
      void audioCtxRef.current?.resume();
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [invRes, orderRes, requestRes] = await Promise.all([
        supabase.from("inventory").select("*").order("category"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase
          .from("requests")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (cancelled) return;

      if (invRes.error) {
        setInventoryError(invRes.error.message);
      } else {
        setInventoryError(null);
        setInventory((invRes.data ?? []).map(mapInventory));
      }

      if (!orderRes.error) {
        setOrders((orderRes.data ?? []).map(mapOrder));
      }

      if (!requestRes.error) {
        setRequests((requestRes.data ?? []).map(mapRequest));
      }

      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const applyInventoryRow = (row: {
      id: string | number;
      name?: string;
      category?: string;
      qty: number;
      price?: number | string | null;
    }) => {
      const mapped = mapInventory({
        id: row.id,
        name: row.name ?? "",
        category: row.category ?? "",
        qty: row.qty,
        price: row.price,
      });
      setInventory((prev) => {
        const index = prev.findIndex((item) => item.id === mapped.id);
        if (index === -1) {
          return [
            ...prev,
            {
              ...mapped,
              name: row.name || mapped.name,
              category: row.category || mapped.category,
            },
          ];
        }
        const next = [...prev];
        next[index] = {
          ...prev[index],
          qty: mapped.qty,
          name: row.name ?? prev[index].name,
          category: row.category ?? prev[index].category,
          price: row.price != null ? mapped.price : prev[index].price,
        };
        return next;
      });
    };

    const unsubOrders = subscribeTableChanges<{
      id: string | number;
      room: string;
      items: unknown;
      total: number | string | null;
      status: string;
      created_at: string;
    }>("orders-realtime", "orders", ["INSERT", "UPDATE"], (event, row) => {
      const mapped = mapOrder(row);
      if (event === "INSERT") {
        setOrders((prev) => {
          if (prev.some((order) => order.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
        playBeep(audioCtxRef.current);
        vibrateShort();
        return;
      }
      setOrders((prev) =>
        prev.map((order) => (order.id === mapped.id ? mapped : order)),
      );
    });

    const unsubRequests = subscribeTableChanges<{
      id: string | number;
      room: string;
      message: string;
      type: string;
      status: string;
      reply: string | null;
      created_at: string;
    }>("requests-realtime", "requests", ["INSERT", "UPDATE"], (event, row) => {
      const mapped = mapRequest(row);
      if (event === "INSERT") {
        setRequests((prev) => {
          if (prev.some((request) => request.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
        return;
      }
      setRequests((prev) =>
        prev.map((request) =>
          request.id === mapped.id ? mapped : request,
        ),
      );
    });

    const unsubInventoryPg = subscribeTableChanges<{
      id: string | number;
      name: string;
      category: string;
      qty: number;
      price?: number | string | null;
    }>("inventory-realtime", "inventory", ["INSERT", "UPDATE", "DELETE"], (event, row) => {
      if (event === "DELETE") {
        setInventory((prev) => prev.filter((item) => item.id !== String(row.id)));
        return;
      }
      applyInventoryRow(row);
    });

    const unsubInventoryBroadcast = subscribeInventoryBroadcast((row) => {
      applyInventoryRow(row);
    });

    const unsubRequestsBroadcast = subscribeRequestsBroadcast((row) => {
      const mapped = mapRequest(row);
      setRequests((prev) => {
        if (prev.some((request) => request.id === mapped.id)) {
          return prev.map((request) =>
            request.id === mapped.id ? mapped : request,
          );
        }
        return [mapped, ...prev];
      });
    });

    return () => {
      unsubOrders();
      unsubRequests();
      unsubInventoryPg();
      unsubInventoryBroadcast();
      unsubRequestsBroadcast();
    };
  }, []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => {
      const current = prev.find((o) => o.id === id);
      if (!current) return prev;
      const previous = current;

      void (async () => {
        const { error } = await supabase
          .from("orders")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) {
          setOrders((now) =>
            now.map((o) => (o.id === id ? previous : o)),
          );
        }
      })();

      return prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              unread: status === "new" ? o.unread : false,
            }
          : o,
      );
    });
  }, []);

  const updateInventoryQty = useCallback((id: string, delta: number) => {
    setInventory((prev) => {
      const item = prev.find((row) => row.id === id);
      if (!item) return prev;
      const previousQty = item.qty;
      const newQty = Math.max(0, item.qty + delta);

      void (async () => {
        const { error } = await supabase
          .from("inventory")
          .update({ qty: newQty })
          .eq("id", id);
        if (error) {
          setInventory((now) =>
            now.map((row) =>
              row.id === id ? { ...row, qty: previousQty } : row,
            ),
          );
          setInventoryError(error.message);
        } else {
          setInventoryError(null);
          void broadcastInventoryUpdate({
            id,
            qty: newQty,
            name: item.name,
            category: item.category,
          });
        }
      })();

      return prev.map((row) =>
        row.id === id ? { ...row, qty: newQty } : row,
      );
    });
  }, []);

  const addInventoryItem = useCallback(
    async (input: {
      name: string;
      category: string;
      price: number;
      qty: number;
    }) => {
      const name = input.name.trim();
      if (!name) return false;
      const qty = Math.max(0, Math.floor(input.qty));
      const price = Math.max(0, Math.round(input.price));
      const { data, error } = await supabase
        .from("inventory")
        .insert({
          name,
          category: input.category,
          price,
          qty,
        })
        .select("*")
        .single();
      if (error || !data) {
        setInventoryError(error?.message ?? "추가에 실패했습니다.");
        return false;
      }
      setInventoryError(null);
      const mapped = mapInventory(data);
      setInventory((prev) =>
        prev.some((item) => item.id === mapped.id) ? prev : [...prev, mapped],
      );
      void broadcastInventoryUpdate({
        id: mapped.id,
        qty: mapped.qty,
        name: mapped.name,
        category: mapped.category,
        price: mapped.price,
      });
      return true;
    },
    [],
  );

  const updateInventoryItem = useCallback(
    async (
      id: string,
      input: { name: string; category: string; price: number },
    ) => {
      const name = input.name.trim();
      if (!name) return false;
      const price = Math.max(0, Math.round(input.price));
      const { data, error } = await supabase
        .from("inventory")
        .update({ name, category: input.category, price })
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        setInventoryError(error.message);
        return false;
      }
      setInventoryError(null);
      const mapped = data
        ? mapInventory(data)
        : { id, name, category: input.category, qty: 0, price };
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: mapped.name,
                category: mapped.category,
                price: mapped.price,
              }
            : item,
        ),
      );
      const current = data ?? mapped;
      void broadcastInventoryUpdate({
        id,
        qty: Number((current as { qty?: number }).qty) || 0,
        name: mapped.name,
        category: mapped.category,
        price: mapped.price,
      });
      return true;
    },
    [],
  );

  const deleteInventoryItem = useCallback(async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      setInventoryError(error.message);
      return false;
    }
    setInventoryError(null);
    setInventory((prev) => prev.filter((item) => item.id !== id));
    return true;
  }, []);

  const answerRequest = useCallback((id: string, reply: string) => {
    const trimmed = reply.trim();
    if (!trimmed) return;

    setRequests((prev) => {
      const current = prev.find((r) => r.id === id);
      if (!current) return prev;
      const previous = current;

      void (async () => {
        const { error } = await supabase
          .from("requests")
          .update({
            reply: trimmed,
            status: "answered",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) {
          setRequests((now) =>
            now.map((r) => (r.id === id ? previous : r)),
          );
        } else {
          void broadcastRequestUpdate({
            id,
            room: current.room,
            message: current.message,
            type: current.type,
            status: "answered",
            reply: trimmed,
            created_at: current.createdAt,
          });
        }
      })();

      return prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "answered" as RequestStatus,
              reply: trimmed,
              unread: false,
            }
          : r,
      );
    });
  }, []);

  const resetRoom = useCallback(async () => {
    const now = new Date().toISOString();
    const [orderRes, requestRes] = await Promise.all([
      supabase
        .from("orders")
        .update({ status: "done", updated_at: now })
        .eq("room", ADMIN_ROOM)
        .neq("status", "done"),
      supabase
        .from("requests")
        .update({ status: "answered", updated_at: now })
        .eq("room", ADMIN_ROOM)
        .neq("status", "answered"),
    ]);

    if (!orderRes.error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.status === "done"
            ? o
            : { ...o, status: "done" as OrderStatus, unread: false },
        ),
      );
    }

    if (!requestRes.error) {
      setRequests((prev) =>
        prev.map((r) =>
          r.status === "answered"
            ? { ...r, unread: false }
            : {
                ...r,
                status: "answered" as RequestStatus,
                reply: r.reply ?? "(체크아웃으로 자동 정리됨)",
                unread: false,
              },
        ),
      );
    }
  }, []);

  const markOrdersSeen = useCallback(() => {
    setOrders((prev) => prev.map((o) => ({ ...o, unread: false })));
  }, []);

  const markRequestsSeen = useCallback(() => {
    setRequests((prev) => prev.map((r) => ({ ...r, unread: false })));
  }, []);

  const todayOrderCount = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return orders.filter((o) => new Date(o.createdAt) >= start).length;
  }, [orders]);

  const pendingCount = useMemo(() => {
    const pendingOrders = orders.filter((o) => o.status !== "done").length;
    const pendingRequests = requests.filter(
      (r) => r.status !== "answered",
    ).length;
    return pendingOrders + pendingRequests;
  }, [orders, requests]);

  const lowStockCount = useMemo(
    () => inventory.filter((i) => i.qty <= 3).length,
    [inventory],
  );

  const unreadOrders = useMemo(
    () => orders.filter((o) => o.unread).length,
    [orders],
  );
  const unreadRequests = useMemo(
    () => requests.filter((r) => r.unread).length,
    [requests],
  );

  const value = useMemo(
    () => ({
      room: ADMIN_ROOM,
      orders,
      inventory,
      requests,
      loading,
      inventoryError,
      setOrderStatus,
      updateInventoryQty,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      answerRequest,
      resetRoom,
      markOrdersSeen,
      markRequestsSeen,
      todayOrderCount,
      pendingCount,
      lowStockCount,
      unreadOrders,
      unreadRequests,
    }),
    [
      orders,
      inventory,
      requests,
      loading,
      inventoryError,
      setOrderStatus,
      updateInventoryQty,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      answerRequest,
      resetRoom,
      markOrdersSeen,
      markRequestsSeen,
      todayOrderCount,
      pendingCount,
      lowStockCount,
      unreadOrders,
      unreadRequests,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
