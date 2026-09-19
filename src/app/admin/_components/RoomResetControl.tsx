"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

export function RoomResetControl() {
  const [sendingSummary, setSendingSummary] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);

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
    </>
  );
}
