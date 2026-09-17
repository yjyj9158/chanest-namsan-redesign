"use client";

import { useState } from "react";
import { FileText, RotateCcw, X } from "lucide-react";
import { useAdmin } from "../_context/AdminContext";

export function RoomResetControl() {
  const { room, resetRoom } = useAdmin();
  const [open, setOpen] = useState(false);
  const [sendingSummary, setSendingSummary] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);

  async function confirm() {
    await resetRoom();
    setOpen(false);
  }

  async function sendCheckoutSummary() {
    if (sendingSummary) return;
    setSendingSummary(true);
    setSummaryMessage(null);
    try {
      const response = await fetch("/api/checkout-summary");
      const payload = (await response.json()) as {
        sent?: boolean;
        error?: string;
      };
      setSummaryMessage(
        payload.sent
          ? "정산 요약을 텔레그램으로 보냈습니다."
          : payload.error ?? "정산 요약 전송에 실패했습니다.",
      );
    } catch {
      setSummaryMessage("정산 요약 전송에 실패했습니다.");
    } finally {
      setSendingSummary(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted-light transition-colors hover:text-admin-alert"
        >
          <RotateCcw className="h-3 w-3" />
          이 방 새 게스트로 초기화 (Room {room})
        </button>
        <button
          type="button"
          onClick={() => void sendCheckoutSummary()}
          disabled={sendingSummary}
          className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted-light transition-colors hover:text-gold-dark disabled:opacity-50"
        >
          <FileText className="h-3 w-3" />
          {sendingSummary ? "보내는 중…" : "정산 요약 보내기"}
        </button>
      </div>
      {summaryMessage ? (
        <p className="text-[0.68rem] text-muted">{summaryMessage}</p>
      ) : null}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-charcoal/45 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-xl">방 초기화</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-muted"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              정말 초기화할까요? 현재 진행 중 주문·문의가 모두 정리됩니다.
              재고는 유지됩니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-line py-2.5 text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirm}
                className="flex-1 rounded-full bg-admin-alert py-2.5 text-sm font-medium text-white"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
