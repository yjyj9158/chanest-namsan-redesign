"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_ROOM_NUMBER,
  fallbackRoom,
  fetchCurrentStayId,
  fetchRoomByNumber,
  type RoomInfo,
} from "@/lib/rooms";

type RoomContextValue = {
  room: RoomInfo;
  roomNumber: string;
  currentStayId: string | null;
  loading: boolean;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({
  roomNumber,
  children,
}: {
  roomNumber: string;
  children: ReactNode;
}) {
  const normalized = roomNumber.trim() || DEFAULT_ROOM_NUMBER;
  const [room, setRoom] = useState<RoomInfo>(() => fallbackRoom(normalized));
  const [currentStayId, setCurrentStayId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { room: fetched } = await fetchRoomByNumber(normalized);
      if (cancelled) return;
      const resolved = fetched ?? fallbackRoom(normalized);
      setRoom(resolved);
      const stayId = await fetchCurrentStayId(resolved.id);
      if (cancelled) return;
      setCurrentStayId(stayId);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  const value = useMemo(
    () => ({
      room,
      roomNumber: room.roomNumber,
      currentStayId,
      loading,
    }),
    [room, currentStayId, loading],
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
}

export function useRoomOptional() {
  return useContext(RoomContext);
}
