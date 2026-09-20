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
import {
  fetchGuestInventory,
  mapInventoryToMinibarItem,
  type InventoryRow,
  type LiveMinibarItem,
} from "@/lib/minibarCatalog";
import {
  subscribeInventoryBroadcast,
  subscribeTableChanges,
} from "@/lib/realtime";
import { useRoom } from "@/context/RoomContext";
import { inventoryVisibleToGuest } from "@/lib/rooms";

export type MinibarCart = Record<string, number>;

export type ServiceSelection = {
  towels: boolean;
  amenities: boolean;
  housekeeping: boolean;
  other: boolean;
};

type OrderContextValue = {
  minibarItems: LiveMinibarItem[];
  minibarReady: boolean;
  minibarError: string | null;
  minibarCart: MinibarCart;
  updateMinibarQty: (id: string, delta: number) => void;
  resetMinibarCart: () => void;
  minibarTotal: number;
  minibarItemCount: number;
  waterQty: number;
  setWaterQty: (qty: number) => void;
  updateWaterQty: (delta: number) => void;
  services: ServiceSelection;
  toggleService: (key: keyof ServiceSelection) => void;
  note: string;
  setNote: (note: string) => void;
  hasAnythingSelected: boolean;
  serviceCount: number;
  selectedCount: number;
  resetAll: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

const EMPTY_SERVICES: ServiceSelection = {
  towels: false,
  amenities: false,
  housekeeping: false,
  other: false,
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const { room } = useRoom();
  const roomNumber = room.roomNumber;
  const [rawInventory, setRawInventory] = useState<InventoryRow[]>([]);
  const [minibarReady, setMinibarReady] = useState(false);
  const [minibarError, setMinibarError] = useState<string | null>(null);
  const [minibarCart, setMinibarCart] = useState<MinibarCart>({});
  const [waterQty, setWaterQtyState] = useState(0);
  const [services, setServices] = useState<ServiceSelection>(EMPTY_SERVICES);
  const [note, setNote] = useState("");
  const roomIdRef = useRef<string | null>(null);

  const minibarItems = useMemo(
    () => rawInventory.map((row) => mapInventoryToMinibarItem(row)),
    [rawInventory],
  );

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setMinibarError((prev) => prev ?? "timeout");
      setMinibarReady(true);
    }, 10000);

    async function load() {
      setMinibarError(null);
      try {
        const result = await fetchGuestInventory(roomNumber);
        if (cancelled) return;
        roomIdRef.current = result.roomId;
        setRawInventory(result.rows);
        setMinibarError(result.error);
        setMinibarReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error("[minibar] inventory load exception", err);
        setMinibarError(err instanceof Error ? err.message : "load failed");
        setMinibarReady(true);
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    void load();

    const applyInventoryRow = (row: InventoryRow) => {
      const id = String(row.id);
      if (!inventoryVisibleToGuest(row, roomIdRef.current)) {
        setRawInventory((prev) => prev.filter((item) => String(item.id) !== id));
        setMinibarCart((prev) => {
          if (!prev[id]) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
        return;
      }
      setRawInventory((prev) => {
        const index = prev.findIndex((item) => String(item.id) === id);
        if (index === -1) return [...prev, row];
        const current = prev[index];
        const next = [...prev];
        next[index] = {
          ...current,
          ...row,
          image_url: row.image_url?.trim() ? row.image_url : current.image_url,
        };
        return next;
      });
      const soldOut = row.available === false || Number(row.qty) <= 0;
      if (soldOut) {
        setMinibarCart((prev) => {
          if (!prev[id]) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    };

    const unsubPg = subscribeTableChanges<InventoryRow>(
      "guest-inventory-realtime",
      "inventory",
      ["INSERT", "UPDATE", "DELETE"],
      (event, row) => {
        if (event === "DELETE") {
          const id = String(row.id);
          setRawInventory((prev) => prev.filter((item) => String(item.id) !== id));
          setMinibarCart((prev) => {
            if (!prev[id]) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
          });
          return;
        }
        applyInventoryRow(row);
      },
    );
    const unsubBroadcast = subscribeInventoryBroadcast((row) => {
      applyInventoryRow(row as InventoryRow);
    });

    return () => {
      cancelled = true;
      unsubPg();
      unsubBroadcast();
    };
  }, [roomNumber]);

  const updateMinibarQty = useCallback((id: string, delta: number) => {
    setMinibarCart((prev) => {
      const next = { ...prev };
      const updated = Math.max(0, (next[id] ?? 0) + delta);
      if (updated === 0) delete next[id];
      else next[id] = updated;
      return next;
    });
  }, []);

  const resetMinibarCart = useCallback(() => setMinibarCart({}), []);

  const setWaterQty = useCallback((qty: number) => {
    setWaterQtyState(Math.max(0, Math.min(20, qty)));
  }, []);

  const updateWaterQty = useCallback((delta: number) => {
    setWaterQtyState((prev) => Math.max(0, Math.min(20, prev + delta)));
  }, []);

  const toggleService = useCallback((key: keyof ServiceSelection) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetAll = useCallback(() => {
    setMinibarCart({});
    setWaterQtyState(0);
    setServices(EMPTY_SERVICES);
    setNote("");
  }, []);

  const minibarTotal = useMemo(
    () =>
      minibarItems.reduce(
        (sum, item) => sum + item.price * (minibarCart[item.id] ?? 0),
        0,
      ),
    [minibarCart, minibarItems],
  );

  const minibarItemCount = useMemo(
    () => Object.values(minibarCart).reduce((s, q) => s + q, 0),
    [minibarCart],
  );

  const serviceCount = useMemo(() => {
    const flags = Object.values(services).filter(Boolean).length;
    return flags + (waterQty > 0 ? 1 : 0) + (note.trim() ? 1 : 0);
  }, [services, waterQty, note]);

  const selectedCount = useMemo(() => {
    const flags = Object.values(services).filter(Boolean).length;
    return minibarItemCount + waterQty + flags;
  }, [minibarItemCount, waterQty, services]);

  const hasAnythingSelected = selectedCount > 0;

  const value = useMemo(
    () => ({
      minibarItems,
      minibarReady,
      minibarError,
      minibarCart,
      updateMinibarQty,
      resetMinibarCart,
      minibarTotal,
      minibarItemCount,
      waterQty,
      setWaterQty,
      updateWaterQty,
      services,
      toggleService,
      note,
      setNote,
      hasAnythingSelected,
      serviceCount,
      selectedCount,
      resetAll,
    }),
    [
      minibarItems,
      minibarReady,
      minibarError,
      minibarCart,
      updateMinibarQty,
      resetMinibarCart,
      minibarTotal,
      minibarItemCount,
      waterQty,
      setWaterQty,
      updateWaterQty,
      services,
      toggleService,
      note,
      hasAnythingSelected,
      serviceCount,
      selectedCount,
      resetAll,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
