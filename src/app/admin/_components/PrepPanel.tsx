"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "../_context/AdminContext";
import type { RoomRow, StayRow } from "@/lib/rooms";
import {
  preferenceKoLabels,
  type PreferenceRecord,
} from "@/lib/preferenceOptions";
import { cn } from "@/lib/utils";

type PreferenceRow = PreferenceRecord & {
  id: string;
  stay_id: string | null;
  room_id: string | null;
  submitted_at?: string | null;
};

type Checklist = {
  scent: boolean;
  pillow: boolean;
  lighting: boolean;
  temperature: boolean;
  extra: boolean;
};

const EMPTY_CHECK: Checklist = {
  scent: false,
  pillow: false,
  lighting: false,
  temperature: false,
  extra: false,
};

function roomLabel(rooms: RoomRow[], roomId: string | null) {
  const found = rooms.find((room) => room.id === roomId);
  return found ? `Room ${found.room_number}` : "객실";
}

function preferenceLink(roomNumber: string) {
  if (typeof window === "undefined") return `/r/${roomNumber}/preferences`;
  return `${window.location.origin}/r/${roomNumber}/preferences`;
}

export function PrepPanel() {
  const { rooms } = useAdmin();
  const [stays, setStays] = useState<StayRow[]>([]);
  const [preferences, setPreferences] = useState<PreferenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, Checklist>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [stayRes, prefRes] = await Promise.all([
        supabase
          .from("stays")
          .select("*")
          .in("status", ["upcoming", "current"])
          .order("check_in", { ascending: true, nullsFirst: false }),
        supabase
          .from("preferences")
          .select("*")
          .order("submitted_at", { ascending: false }),
      ]);
      if (cancelled) return;
      setStays((stayRes.data ?? []) as StayRow[]);
      setPreferences((prefRes.data ?? []) as PreferenceRow[]);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(
    () => stays.filter((stay) => stay.status === "upcoming"),
    [stays],
  );
  const current = useMemo(
    () => stays.filter((stay) => stay.status === "current"),
    [stays],
  );

  function prefForStay(stayId: string) {
    return preferences.find((pref) => pref.stay_id === stayId) ?? null;
  }

  function prefForRoom(roomId: string) {
    return preferences.find((pref) => pref.room_id === roomId && !pref.stay_id) ?? null;
  }

  async function copyLink(roomNumber: string) {
    const url = preferenceLink(roomNumber);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(roomNumber);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  function toggleCheck(stayId: string, key: keyof Checklist) {
    setChecks((prev) => {
      const currentCheck = prev[stayId] ?? EMPTY_CHECK;
      return {
        ...prev,
        [stayId]: { ...currentCheck, [key]: !currentCheck[key] },
      };
    });
  }

  function StayCard({ stay }: { stay: StayRow }) {
    const pref = prefForStay(stay.id) ?? prefForRoom(stay.room_id ?? "");
    const labels = pref ? preferenceKoLabels(pref) : null;
    const room = rooms.find((row) => row.id === stay.room_id);
    const check = checks[stay.id] ?? EMPTY_CHECK;

    return (
      <article className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-medium tracking-widest text-gold uppercase">
              {roomLabel(rooms, stay.room_id)}
            </p>
            <h3 className="mt-1 font-serif text-xl">
              {stay.guest_name || "게스트"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {stay.check_in ? `체크인 ${stay.check_in}` : "체크인 일정 미정"}
              {stay.check_out ? ` · 체크아웃 ${stay.check_out}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[0.65rem] text-muted">
            {stay.status === "current" ? "투숙 중" : "예정"}
          </span>
        </div>

        {labels ? (
          <div className="mt-4 space-y-2 rounded-xl bg-cream px-3 py-3 text-sm">
            {labels.scent ? <p>향: {labels.scent}</p> : null}
            {labels.pillow ? <p>베개: {labels.pillow}</p> : null}
            {labels.lighting ? <p>조명: {labels.lighting}</p> : null}
            {labels.temperature ? <p>온도: {labels.temperature}</p> : null}
            {labels.party ? <p>동행: {labels.party}</p> : null}
            {pref?.special_request ? <p>메모: {pref.special_request}</p> : null}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-admin-warn-bg px-2.5 py-1 text-[0.68rem] text-admin-warn">
              취향 미제출
            </span>
            {room ? (
              <button
                type="button"
                onClick={() => void copyLink(room.room_number)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted hover:border-gold hover:text-gold-dark"
              >
                <Copy className="h-3 w-3" />
                {copied === room.room_number ? "복사됨" : "취향 링크 복사"}
              </button>
            ) : null}
          </div>
        )}

        {labels ? (
          <div className="mt-4 space-y-2">
            <p className="text-[0.68rem] text-muted">세팅 완료 체크</p>
            {(
              [
                ["scent", "향"],
                ["pillow", "베개"],
                ["lighting", "조명"],
                ["temperature", "온도"],
                ["extra", "기타 메모"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-charcoal"
              >
                <input
                  type="checkbox"
                  checked={check[key]}
                  onChange={() => toggleCheck(stay.id, key)}
                  className="h-4 w-4 accent-gold"
                />
                {label}
                {check[key] ? (
                  <Check className="h-3.5 w-3.5 text-gold-dark" />
                ) : null}
              </label>
            ))}
          </div>
        ) : null}
      </article>
    );
  }

  const orphanPrefs = preferences.filter(
    (pref) =>
      pref.room_id &&
      !pref.stay_id &&
      !stays.some((stay) => stay.room_id === pref.room_id),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">객실 준비</h1>
        <p className="mt-1 text-sm text-muted">
          게스트 취향을 확인하고 체크인 전 세팅을 완료하세요.
        </p>
      </header>

      {loading ? (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
        </p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">다가오는 투숙</h2>
            {upcoming.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
                예정된 투숙이 없습니다.
              </p>
            ) : (
              upcoming.map((stay) => <StayCard key={stay.id} stay={stay} />)
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl">현재 투숙</h2>
            {current.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
                현재 투숙 중인 객실이 없습니다.
              </p>
            ) : (
              current.map((stay) => <StayCard key={stay.id} stay={stay} />)
            )}
          </section>

          {orphanPrefs.length > 0 ? (
            <section className="space-y-3">
              <h2 className="font-serif text-xl">투숙 없이 제출된 취향</h2>
              {orphanPrefs.map((pref) => {
                const labels = preferenceKoLabels(pref);
                const room = rooms.find((row) => row.id === pref.room_id);
                return (
                  <article
                    key={pref.id}
                    className="rounded-2xl border border-line bg-white p-4 shadow-sm"
                  >
                    <p className="text-[0.65rem] font-medium tracking-widest text-gold uppercase">
                      {room ? `Room ${room.room_number}` : "객실"}
                    </p>
                    <div className="mt-3 space-y-1 text-sm">
                      {labels.scent ? <p>향: {labels.scent}</p> : null}
                      {labels.pillow ? <p>베개: {labels.pillow}</p> : null}
                      {labels.lighting ? <p>조명: {labels.lighting}</p> : null}
                      {labels.temperature ? <p>온도: {labels.temperature}</p> : null}
                      {labels.party ? <p>동행: {labels.party}</p> : null}
                      {pref.special_request ? <p>메모: {pref.special_request}</p> : null}
                    </div>
                  </article>
                );
              })}
            </section>
          ) : null}

          <section className={cn("space-y-3")}>
            <h2 className="flex items-center gap-2 font-serif text-xl">
              <Sparkles className="h-4 w-4 text-gold-dark" />
              취향 링크
            </h2>
            {rooms
              .filter((room) => room.is_active !== false)
              .map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-serif text-lg">Room {room.room_number}</p>
                    <p className="text-[0.68rem] text-muted">
                      {preferenceLink(room.room_number)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyLink(room.room_number)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3 py-2 text-[0.68rem] text-white"
                  >
                    <Copy className="h-3 w-3" />
                    {copied === room.room_number ? "복사됨" : "링크 복사"}
                  </button>
                </div>
              ))}
          </section>
        </>
      )}
    </div>
  );
}
