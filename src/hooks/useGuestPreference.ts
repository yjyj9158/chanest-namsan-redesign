"use client";

import { useEffect, useState } from "react";
import type { PreferenceRecord } from "@/lib/preferenceOptions";
import { useRoom } from "@/context/RoomContext";

export type GuestPreference = PreferenceRecord & {
  id?: string;
};

export function useGuestPreference() {
  const { room, loading: roomLoading } = useRoom();
  const [preference, setPreference] = useState<GuestPreference | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (roomLoading) return;
    let cancelled = false;

    async function load() {
      try {
        const params = new URLSearchParams({ room: room.roomNumber });
        if (room.id) params.set("roomId", room.id);
        const response = await fetch(`/api/preferences?${params.toString()}`);
        const payload = (await response.json()) as {
          preference?: GuestPreference | null;
        };
        if (cancelled) return;
        setPreference(payload.preference ?? null);
      } catch {
        if (!cancelled) setPreference(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [room.id, room.roomNumber, roomLoading]);

  return { preference, loaded: loaded && !roomLoading, room };
}
