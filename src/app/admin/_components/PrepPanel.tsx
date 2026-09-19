"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  FileText,
  LogOut,
  MessageSquareText,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "../_context/AdminContext";
import type { RoomRow, StayRow } from "@/lib/rooms";
import {
  PARTY_OPTIONS,
  preferenceKoLabels,
  type PreferenceRecord,
} from "@/lib/preferenceOptions";
import {
  addDaysIso,
  formatStayRange,
  maskGuestName,
  seoulDateString,
} from "@/lib/stayDates";
import { formatKRWAmount } from "../_data/mock";
import { cn } from "@/lib/utils";

type PreferenceRow = PreferenceRecord & {
  id: string;
  stay_id: string | null;
  room_id: string | null;
  submitted_at?: string | null;
};

type OrderRow = {
  id: string;
  stay_id: string | null;
  total: number | string | null;
  status: string | null;
};

type RequestRow = {
  id: string;
  stay_id: string | null;
  status: string | null;
};

type StayTab = "current" | "upcoming" | "completed";
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

function guestMessageTemplate(roomNumber: string) {
  const url = preferenceLink(roomNumber);
  return `안녕하세요, THE CHANEST NAMSAN입니다.

도착 전 아래 링크에서 선호하시는 향, 베개, 조명을 알려주시면
체크인하실 때 맞춰 준비해 두겠습니다.

${url}

— 

Hello, this is THE CHANEST NAMSAN.

Please let us know your preferred scent, pillow, and lighting
before your arrival, and we'll have everything ready for you.

${url}`;
}

export function PrepPanel() {
  const { rooms } = useAdmin();
  const [stays, setStays] = useState<StayRow[]>([]);
  const [preferences, setPreferences] = useState<PreferenceRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, Checklist>>({});
  const [tab, setTab] = useState<StayTab>("current");
  const [formOpen, setFormOpen] = useState(false);
  const [checkoutStay, setCheckoutStay] = useState<StayRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [stayRes, prefRes, orderRes, requestRes] = await Promise.all([
      supabase
        .from("stays")
        .select("*")
        .order("check_in", { ascending: false, nullsFirst: false }),
      supabase
        .from("preferences")
        .select("*")
        .order("submitted_at", { ascending: false }),
      supabase.from("orders").select("id, stay_id, total, status"),
      supabase.from("requests").select("id, stay_id, status"),
    ]);
    setStays((stayRes.data ?? []) as StayRow[]);
    setPreferences((prefRes.data ?? []) as PreferenceRow[]);
    setOrders((orderRes.data ?? []) as OrderRow[]);
    setRequests((requestRes.data ?? []) as RequestRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(
    () => ({
      current: stays.filter((stay) => stay.status === "current"),
      upcoming: stays.filter((stay) => stay.status === "upcoming"),
      completed: stays.filter((stay) => stay.status === "completed"),
    }),
    [stays],
  );

  function prefForStay(stayId: string) {
    return preferences.find((pref) => pref.stay_id === stayId) ?? null;
  }

  function prefForRoom(roomId: string) {
    return preferences.find((pref) => pref.room_id === roomId && !pref.stay_id) ?? null;
  }

  function stayTotals(stayId: string) {
    const stayOrders = orders.filter((order) => order.stay_id === stayId);
    const stayRequests = requests.filter((row) => row.stay_id === stayId);
    return {
      orderCount: stayOrders.length,
      orderTotal: stayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
      requestCount: stayRequests.length,
      unanswered: stayRequests.filter((row) => row.status !== "answered").length,
    };
  }

  async function copyLink(roomNumber: string) {
    try {
      await navigator.clipboard.writeText(preferenceLink(roomNumber));
      setCopied(`link-${roomNumber}`);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  async function copyTemplate(roomNumber: string) {
    try {
      await navigator.clipboard.writeText(guestMessageTemplate(roomNumber));
      setCopied(`msg-${roomNumber}`);
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

  async function sendStaySummary(stayId: string) {
    setBusyId(stayId);
    setNotice(null);
    try {
      const response = await fetch(`/api/checkout-summary?stay_id=${stayId}`);
      const payload = (await response.json()) as { sent?: boolean; error?: string };
      setNotice(
        payload.sent
          ? "정산 요약을 텔레그램으로 보냈습니다."
          : payload.error ?? "정산 요약 전송에 실패했습니다.",
      );
    } catch {
      setNotice("정산 요약 전송에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmCheckout() {
    if (!checkoutStay) return;
    setBusyId(checkoutStay.id);
    setNotice(null);
    try {
      const response = await fetch(`/api/stays/${checkoutStay.id}/checkout`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        sent?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setNotice(payload.error ?? "체크아웃 처리에 실패했습니다.");
      } else {
        setNotice(
          payload.sent
            ? "체크아웃 처리하고 정산 요약을 보냈습니다."
            : "체크아웃 처리했습니다. 텔레그램 전송은 실패했습니다.",
        );
        setCheckoutStay(null);
        await load();
      }
    } catch {
      setNotice("체크아웃 처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  function StayCard({ stay }: { stay: StayRow }) {
    const pref = prefForStay(stay.id) ?? prefForRoom(stay.room_id ?? "");
    const labels = pref ? preferenceKoLabels(pref) : null;
    const room = rooms.find((row) => row.id === stay.room_id);
    const check = checks[stay.id] ?? EMPTY_CHECK;
    const totals = stayTotals(stay.id);
    const guestCount = stay.guest_count ?? 2;
    const isCurrent = stay.status === "current";

    return (
      <article className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-medium tracking-widest text-gold uppercase">
              {roomLabel(rooms, stay.room_id)}
            </p>
            <h3 className="mt-1 font-serif text-xl">
              {stay.guest_name
                ? `${maskGuestName(stay.guest_name)} 님 · ${guestCount}명`
                : `게스트 · ${guestCount}명`}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {formatStayRange(stay.check_in, stay.check_out)}
            </p>
          </div>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[0.65rem] text-muted">
            {stay.status === "current"
              ? "투숙 중"
              : stay.status === "upcoming"
                ? "예정"
                : "완료"}
          </span>
        </div>

        {labels ? (
          <p className="mt-4 text-sm">
            🛏 취향: {[labels.scent, labels.pillow, labels.lighting]
              .filter(Boolean)
              .join(" / ") || "제출됨"}
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-admin-warn-bg px-2.5 py-1 text-[0.68rem] text-admin-warn">
              취향 미제출
            </span>
            {room ? (
              <>
                <button
                  type="button"
                  onClick={() => void copyLink(room.room_number)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted hover:border-gold hover:text-gold-dark"
                >
                  <Copy className="h-3 w-3" />
                  {copied === `link-${room.room_number}` ? "복사됨" : "취향 링크 복사"}
                </button>
                <button
                  type="button"
                  onClick={() => void copyTemplate(room.room_number)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted hover:border-gold hover:text-gold-dark"
                >
                  <MessageSquareText className="h-3 w-3" />
                  {copied === `msg-${room.room_number}`
                    ? "복사됨"
                    : "메시지 템플릿 복사"}
                </button>
              </>
            ) : null}
          </div>
        )}

        <p className="mt-2 text-sm">
          🛒 주문 {totals.orderCount}건 · {formatKRWAmount(totals.orderTotal)}
          {totals.requestCount > 0
            ? ` · 요청 ${totals.requestCount}건${
                totals.unanswered > 0 ? ` (미답변 ${totals.unanswered})` : ""
              }`
            : ""}
        </p>

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

        {isCurrent ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busyId === stay.id}
              onClick={() => void sendStaySummary(stay.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-sm disabled:opacity-40"
            >
              <FileText className="h-3.5 w-3.5" />
              정산 요약
            </button>
            <button
              type="button"
              onClick={() => setCheckoutStay(stay)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-charcoal py-2.5 text-sm text-cream"
            >
              <LogOut className="h-3.5 w-3.5" />
              체크아웃 처리
            </button>
          </div>
        ) : null}
      </article>
    );
  }

  const visible = grouped[tab];
  const orphanPrefs = preferences.filter(
    (pref) =>
      pref.room_id &&
      !pref.stay_id &&
      !stays.some((stay) => stay.room_id === pref.room_id && stay.status !== "completed"),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">투숙 관리</h1>
        <p className="mt-1 text-sm text-muted">
          체크인부터 정산까지 손님 단위로 묶습니다. 취향 세팅도 여기서 확인하세요.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-1 rounded-full bg-white p-1">
        {(
          [
            ["current", "현재 투숙"],
            ["upcoming", "예정"],
            ["completed", "지난 기록"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full py-2 text-[0.72rem] font-medium",
              tab === id ? "bg-charcoal text-cream" : "text-muted hover:text-charcoal",
            )}
          >
            {label}
            <span className="ml-1 tabular-nums">({grouped[id].length})</span>
          </button>
        ))}
      </div>

      {notice ? <p className="text-sm text-muted">{notice}</p> : null}

      {loading ? (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
          불러오는 중…
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
          {tab === "current"
            ? "현재 투숙 중인 객실이 없습니다."
            : tab === "upcoming"
              ? "예정된 투숙이 없습니다."
              : "지난 투숙 기록이 없습니다."}
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-charcoal py-3 text-sm text-cream"
      >
        <Plus className="h-4 w-4" />
        새 투숙 등록
      </button>

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

      <section className="space-y-3">
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
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => void copyLink(room.room_number)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-3 py-2 text-[0.68rem] text-white"
                >
                  <Copy className="h-3 w-3" />
                  {copied === `link-${room.room_number}` ? "복사됨" : "링크 복사"}
                </button>
                <button
                  type="button"
                  onClick={() => void copyTemplate(room.room_number)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[0.68rem] text-muted"
                >
                  <MessageSquareText className="h-3 w-3" />
                  {copied === `msg-${room.room_number}`
                    ? "복사됨"
                    : "메시지 템플릿 복사"}
                </button>
              </div>
            </div>
          ))}
      </section>

      {formOpen ? (
        <StayCreateForm
          rooms={rooms}
          onClose={() => setFormOpen(false)}
          onCreated={async (status) => {
            setFormOpen(false);
            setTab(status === "upcoming" ? "upcoming" : "current");
            await load();
          }}
        />
      ) : null}

      {checkoutStay ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/50 p-4 sm:items-center"
          onClick={() => setCheckoutStay(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-xl">체크아웃 처리</h2>
              <button
                type="button"
                onClick={() => setCheckoutStay(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-cream text-muted"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              체크아웃 처리하시겠습니까? 이 투숙의 주문·요청이 마감됩니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStay(null)}
                className="flex-1 rounded-full border border-line py-2.5 text-sm"
              >
                취소
              </button>
              <button
                type="button"
                disabled={busyId === checkoutStay.id}
                onClick={() => void confirmCheckout()}
                className="flex-1 rounded-full bg-admin-alert py-2.5 text-sm font-medium text-white disabled:opacity-40"
              >
                {busyId === checkoutStay.id ? "처리 중…" : "체크아웃"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StayCreateForm({
  rooms,
  onClose,
  onCreated,
}: {
  rooms: RoomRow[];
  onClose: () => void;
  onCreated: (status: string) => Promise<void>;
}) {
  const today = seoulDateString();
  const activeRooms = rooms.filter((room) => room.is_active !== false);
  const [roomId, setRoomId] = useState(activeRooms[0]?.id ?? "");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDaysIso(today, 2));
  const [guestCount, setGuestCount] = useState("2");
  const [partyType, setPartyType] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState<{
    visitCount: number;
    preference: PreferenceRow | null;
  } | null>(null);
  const [copyPrefs, setCopyPrefs] = useState(false);

  useEffect(() => {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      setReturning(null);
      setCopyPrefs(false);
      return;
    }
    const handle = window.setTimeout(() => {
      void (async () => {
        const response = await fetch(
          `/api/stays/returning?email=${encodeURIComponent(trimmed)}`,
        );
        const payload = (await response.json()) as {
          visitCount?: number;
          preference?: PreferenceRow | null;
        };
        if ((payload.visitCount ?? 0) > 0) {
          setReturning({
            visitCount: payload.visitCount ?? 0,
            preference: payload.preference ?? null,
          });
        } else {
          setReturning(null);
          setCopyPrefs(false);
        }
      })();
    }, 400);
    return () => window.clearTimeout(handle);
  }, [email]);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          guestName,
          guestEmail: email,
          checkIn,
          checkOut,
          guestCount: Number(guestCount) || 2,
          partyType: partyType || null,
        }),
      });
      const payload = (await response.json()) as {
        stay?: StayRow;
        error?: string;
      };
      if (!response.ok || !payload.stay) {
        setError(payload.error ?? "투숙을 등록하지 못했습니다.");
        setSaving(false);
        return;
      }

      if (copyPrefs && returning?.preference) {
        const roomNumber =
          rooms.find((room) => room.id === roomId)?.room_number ?? "301";
        const pref = returning.preference;
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomNumber,
            stayId: payload.stay.id,
            scent: pref.scent,
            pillowFirmness: pref.pillow_firmness,
            lighting: pref.lighting,
            temperature: pref.temperature,
            partyType: pref.party_type ?? (partyType || null),
            specialRequest: pref.special_request,
            guestEmail: email,
          }),
        });
      }

      await onCreated(payload.stay.status);
    } catch {
      setError("투숙을 등록하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const returningLabels = returning?.preference
    ? preferenceKoLabels(returning.preference)
    : null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-cream p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-2xl">새 투숙 등록</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block text-[0.68rem] text-muted">객실</label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        >
          {activeRooms.map((room) => (
            <option key={room.id} value={room.id}>
              Room {room.room_number}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-[0.68rem] text-muted">게스트 이름</label>
        <input
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          placeholder="선택"
        />

        <label className="mt-3 block text-[0.68rem] text-muted">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          placeholder="재방문 취향 불러오기용"
        />

        {returning ? (
          <div className="mt-3 rounded-xl border border-gold/40 bg-white px-3 py-3 text-sm">
            <p>🔄 재방문 게스트 ({returning.visitCount + 1}번째 방문)</p>
            {returningLabels ? (
              <p className="mt-1 text-muted">
                지난 취향:{" "}
                {[
                  returningLabels.scent,
                  returningLabels.pillow,
                  returningLabels.lighting,
                ]
                  .filter(Boolean)
                  .join(" / ") || "기록 있음"}
              </p>
            ) : (
              <p className="mt-1 text-muted">이전 취향 기록은 없습니다.</p>
            )}
            {returning.preference ? (
              <button
                type="button"
                onClick={() => setCopyPrefs((prev) => !prev)}
                className={cn(
                  "mt-2 rounded-full px-3 py-1.5 text-[0.72rem]",
                  copyPrefs ? "bg-charcoal text-cream" : "border border-line text-muted",
                )}
              >
                {copyPrefs ? "지난번 설정으로 준비합니다" : "지난번 설정으로 준비할까요?"}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[0.68rem] text-muted">체크인</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-[0.68rem] text-muted">체크아웃</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <label className="mt-3 block text-[0.68rem] text-muted">인원</label>
        <input
          type="number"
          min={1}
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        />

        <label className="mt-3 block text-[0.68rem] text-muted">동행 유형</label>
        <select
          value={partyType}
          onChange={(e) => setPartyType(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        >
          <option value="">선택 안 함</option>
          {PARTY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.ko}
            </option>
          ))}
        </select>

        {error ? <p className="mt-3 text-sm text-admin-alert">{error}</p> : null}

        <button
          type="button"
          disabled={saving || !roomId}
          onClick={() => void submit()}
          className="mt-5 w-full rounded-full bg-charcoal py-3 text-sm text-cream disabled:opacity-40"
        >
          {saving ? "등록 중…" : "등록"}
        </button>
      </div>
    </div>
  );
}
