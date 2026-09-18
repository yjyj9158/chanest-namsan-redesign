"use client";

import { useAdmin } from "../_context/AdminContext";

export function RoomFilter() {
  const { rooms, selectedRoomId, setSelectedRoomId } = useAdmin();
  if (rooms.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-[0.68rem] tracking-wide text-muted">객실</label>
      <select
        value={selectedRoomId}
        onChange={(e) => setSelectedRoomId(e.target.value as "all" | string)}
        className="rounded-full border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-gold"
      >
        <option value="all">전체</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.room_number} · {room.name}
          </option>
        ))}
      </select>
    </div>
  );
}
