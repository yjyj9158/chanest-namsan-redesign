"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hotelData } from "@/data/hotelData";

export type MinibarCart = Record<number, number>;

export type ServiceSelection = {
  towels: boolean;
  amenities: boolean;
  housekeeping: boolean;
  other: boolean;
};

type OrderContextValue = {
  minibarCart: MinibarCart;
  updateMinibarQty: (id: number, delta: number) => void;
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
  const [minibarCart, setMinibarCart] = useState<MinibarCart>({});
  const [waterQty, setWaterQtyState] = useState(0);
  const [services, setServices] = useState<ServiceSelection>(EMPTY_SERVICES);
  const [note, setNote] = useState("");

  const updateMinibarQty = useCallback((id: number, delta: number) => {
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
      hotelData.minibarItems.reduce(
        (sum, item) => sum + item.price * (minibarCart[item.id] ?? 0),
        0
      ),
    [minibarCart]
  );

  const minibarItemCount = useMemo(
    () => Object.values(minibarCart).reduce((s, q) => s + q, 0),
    [minibarCart]
  );

  const serviceCount = useMemo(() => {
    const flags = Object.values(services).filter(Boolean).length;
    return flags + (waterQty > 0 ? 1 : 0) + (note.trim() ? 1 : 0);
  }, [services, waterQty, note]);

  const hasAnythingSelected =
    minibarItemCount > 0 || serviceCount > 0;

  const value = useMemo(
    () => ({
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
      resetAll,
    }),
    [
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
      resetAll,
    ]
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
