"use client";

import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useAdmin } from "../_context/AdminContext";

export function RoomResetControl() {
  const { room, resetRoom } = useAdmin();
  const [open, setOpen] = useState(false);

  async function confirm() {
    await resetRoom();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted-light transition-colors hover:text-admin-alert"
      >
        <RotateCcw className="h-3 w-3" />
        이 방 새 게스트로 초기화 (Room {room})
      </button>

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
