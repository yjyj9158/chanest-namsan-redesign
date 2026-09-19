"use client";

import { useState } from "react";
import { Copy, QrCode } from "lucide-react";
import { useAdmin } from "../_context/AdminContext";
import type { RoomRow } from "@/lib/rooms";
import { QrGenerator } from "./QrGenerator";

const EMPTY_FORM = {
  room_number: "",
  name: "",
  capacity: "2",
  wifi_ssid: "",
  wifi_password: "",
  door_code: "",
  checkout_time: "11:00",
};

export function RoomsManager() {
  const { rooms, upsertRoom, setRoomActive } = useAdmin();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrRoom, setQrRoom] = useState<string | null>(null);

  function fill(room: RoomRow) {
    setEditingId(room.id);
    setOpen(true);
    setForm({
      room_number: room.room_number,
      name: room.name,
      capacity: String(room.capacity ?? 2),
      wifi_ssid: room.wifi_ssid ?? "",
      wifi_password: room.wifi_password ?? "",
      door_code: room.door_code ?? "",
      checkout_time: room.checkout_time ?? "11:00",
    });
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    const ok = await upsertRoom({
      id: editingId ?? undefined,
      room_number: form.room_number.trim(),
      name: form.name.trim() || `Room ${form.room_number.trim()}`,
      capacity: Number(form.capacity) || 2,
      wifi_ssid: form.wifi_ssid.trim() || null,
      wifi_password: form.wifi_password.trim() || null,
      door_code: form.door_code.trim() || null,
      checkout_time: form.checkout_time.trim() || "11:00",
    });
    setSaving(false);
    if (!ok) {
      setError("객실 저장에 실패했습니다. 마이그레이션 SQL 실행 여부를 확인해 주세요.");
      return;
    }
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(false);
  }

  async function copyQr(roomNumber: string) {
    const url =
      typeof window === "undefined"
        ? `/r/${roomNumber}`
        : `${window.location.origin}/r/${roomNumber}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(roomNumber);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-xl">객실 관리</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(EMPTY_FORM);
            setOpen((value) => !value);
          }}
          className="text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
        >
          {open ? "접기" : "객실 추가"}
        </button>
      </div>

      {open ? (
        <form
          className="mt-4 grid grid-cols-2 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
        >
          <input
            value={form.room_number}
            onChange={(e) => setForm({ ...form, room_number: e.target.value })}
            placeholder="방 번호"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="객실명"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            placeholder="정원"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={form.checkout_time}
            onChange={(e) => setForm({ ...form, checkout_time: e.target.value })}
            placeholder="체크아웃"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={form.wifi_ssid}
            onChange={(e) => setForm({ ...form, wifi_ssid: e.target.value })}
            placeholder="Wi-Fi SSID"
            className="col-span-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={form.wifi_password}
            onChange={(e) => setForm({ ...form, wifi_password: e.target.value })}
            placeholder="Wi-Fi 비밀번호"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={form.door_code}
            onChange={(e) => setForm({ ...form, door_code: e.target.value })}
            placeholder="도어락 코드"
            className="rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={saving || !form.room_number.trim()}
            className="col-span-2 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? "저장 중…" : editingId ? "객실 수정" : "객실 추가"}
          </button>
        </form>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-admin-alert">{error}</p>
      ) : null}

      <div className="mt-4 space-y-3">
        {rooms.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            등록된 객실이 없습니다. 마이그레이션 SQL을 실행한 뒤 새로고침해 주세요.
          </p>
        ) : (
          rooms.map((room) => (
            <article
              key={room.id}
              className="rounded-xl border border-line px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg">
                    Room {room.room_number}
                    {room.is_active === false ? (
                      <span className="ml-2 text-xs text-muted">비활성</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted">{room.name}</p>
                  <p className="mt-1 text-[0.68rem] text-muted-light">
                    정원 {room.capacity ?? 2} · 체크아웃 {room.checkout_time ?? "11:00"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQrRoom(room.room_number)}
                    className="inline-flex items-center gap-1 rounded-full bg-charcoal px-3 py-1 text-[0.68rem] text-cream"
                  >
                    <QrCode className="h-3 w-3" />
                    QR 코드
                  </button>
                  <button
                    type="button"
                    onClick={() => void copyQr(room.room_number)}
                    className="inline-flex items-center gap-1 text-[0.68rem] text-gold-dark"
                  >
                    <Copy className="h-3 w-3" />
                    {copied === room.room_number ? "복사됨" : "QR 링크 복사"}
                  </button>
                  <button
                    type="button"
                    onClick={() => fill(room)}
                    className="text-[0.68rem] text-muted underline-offset-4 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void setRoomActive(room.id, room.is_active === false)
                    }
                    className="text-[0.68rem] text-muted underline-offset-4 hover:underline"
                  >
                    {room.is_active === false ? "활성화" : "비활성화"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      {qrRoom ? (
        <QrGenerator roomNumber={qrRoom} onClose={() => setQrRoom(null)} />
      ) : null}
    </section>
  );
}
