"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Copy, Printer, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type QrKind = "guide" | "preferences";

const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const,
  margin: 2,
  width: 1024,
  color: {
    dark: "#1a1814",
    light: "#f7f4ef",
  },
};

function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function isLocalOrigin(origin: string) {
  return /localhost|127\.0\.0\.1/i.test(origin);
}

export function roomQrUrl(roomNumber: string, kind: QrKind, origin = siteOrigin()) {
  const path =
    kind === "preferences"
      ? `/r/${encodeURIComponent(roomNumber)}/preferences`
      : `/r/${encodeURIComponent(roomNumber)}`;
  return `${origin}${path}`;
}

function downloadPng(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openPrintCard(input: {
  roomNumber: string;
  kind: QrKind;
  dataUrl: string;
}) {
  const isGuide = input.kind === "guide";
  const ko = isGuide ? "객실 안내 · 미니바 주문" : "체크인 전 취향 설문";
  const en = isGuide ? "Room Guide & Minibar" : "Preferences before arrival";
  const koHint = isGuide
    ? "스캔하여 이용해 주세요"
    : "스캔하여 향·침구를 알려 주세요";
  const enHint = isGuide
    ? "Scan to access"
    : "Scan to share your preferences";

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>THE CHANEST NAMSAN · Room ${input.roomNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    :root { color-scheme: only light; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      background: #f7f4ef;
      color: #1a1814;
      font-family: Outfit, system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card {
      width: 105mm;
      min-height: 148mm;
      padding: 14mm 12mm;
      text-align: center;
      background: #f7f4ef;
      border: 1px solid #b8956a;
    }
    .brand {
      font-family: "Cormorant Garamond", serif;
      font-size: 22px;
      letter-spacing: 0.28em;
    }
    .place {
      margin-top: 6px;
      font-size: 10px;
      letter-spacing: 0.42em;
      color: #b8956a;
      text-transform: uppercase;
    }
    .qr {
      width: 58mm;
      height: 58mm;
      margin: 16mm auto 12mm;
      object-fit: contain;
    }
    .ko {
      font-family: "Cormorant Garamond", serif;
      font-size: 18px;
    }
    .en {
      margin-top: 4px;
      font-size: 12px;
      letter-spacing: 0.06em;
      color: #6b6560;
    }
    .hint {
      margin-top: 14px;
      font-size: 12px;
      color: #1a1814;
    }
    .hint-en {
      margin-top: 3px;
      font-size: 11px;
      color: #6b6560;
    }
    .room {
      margin-top: 18mm;
      font-family: "Cormorant Garamond", serif;
      font-size: 20px;
      letter-spacing: 0.18em;
    }
    @page { size: A6; margin: 0; }
    @media print {
      html, body { background: #f7f4ef; }
      .page { padding: 0; min-height: auto; }
      .card { border-width: 0.4mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <article class="card">
      <div class="brand">THE CHANEST</div>
      <div class="place">Namsan</div>
      <img class="qr" src="${input.dataUrl}" alt="QR code" />
      <div class="ko">${ko}</div>
      <div class="en">${en}</div>
      <div class="hint">${koHint}</div>
      <div class="hint-en">${enHint}</div>
      <div class="room">Room ${input.roomNumber}</div>
    </article>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.focus(); window.print(); }, 250);
    });
  </script>
</body>
</html>`;

  const popup = window.open("", "_blank", "width=520,height=760");
  if (!popup) return;
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}

export function QrGenerator({
  roomNumber,
  onClose,
}: {
  roomNumber: string;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<QrKind>("guide");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const origin = useMemo(() => siteOrigin(), []);
  const url = useMemo(
    () => roomQrUrl(roomNumber, kind, origin),
    [origin, roomNumber, kind],
  );
  const localWarning = isLocalOrigin(origin);

  useEffect(() => {
    let cancelled = false;
    setDataUrl(null);
    setError(null);
    QRCode.toDataURL(url, QR_OPTIONS)
      .then((next) => {
        if (!cancelled) setDataUrl(next);
      })
      .catch(() => {
        if (!cancelled) setError("QR 코드를 만들지 못했습니다.");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const filename =
    kind === "preferences"
      ? `chanest-${roomNumber}-preferences-qr.png`
      : `chanest-${roomNumber}-guide-qr.png`;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        className="w-full max-w-md rounded-3xl bg-cream p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] tracking-[0.22em] text-gold uppercase">
              THE CHANEST NAMSAN
            </p>
            <h2 id="qr-title" className="mt-1 font-serif text-2xl">
              Room {roomNumber} QR 코드
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-charcoal/5"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-white p-1">
          {(
            [
              ["guide", "객실 가이드"],
              ["preferences", "취향 설문"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              className={cn(
                "rounded-full py-2 text-[0.78rem] font-medium transition-colors",
                kind === id
                  ? "bg-charcoal text-cream"
                  : "text-muted hover:text-charcoal",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-2xl border border-gold/40 bg-cream p-3">
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt={`Room ${roomNumber} ${kind} QR`}
                className="h-56 w-56"
              />
            ) : (
              <div className="grid h-56 w-56 place-items-center text-sm text-muted">
                {error ?? "생성 중…"}
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 break-all text-center text-[0.72rem] text-muted">
          {url}
        </p>
        {localWarning ? (
          <p className="mt-2 text-center text-[0.72rem] text-admin-alert">
            현재 localhost 주소입니다. 배포 사이트에서 생성하세요.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void copyLink()}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-white py-2.5 text-sm"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "복사됨" : "링크 복사"}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!dataUrl}
            onClick={() => dataUrl && downloadPng(dataUrl, filename)}
            className="rounded-full bg-charcoal py-2.5 text-sm text-cream disabled:opacity-40"
          >
            PNG 다운로드
          </button>
          <button
            type="button"
            disabled={!dataUrl}
            onClick={() =>
              dataUrl &&
              openPrintCard({ roomNumber, kind, dataUrl })
            }
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-charcoal/15 py-2.5 text-sm disabled:opacity-40"
          >
            <Printer className="h-3.5 w-3.5" />
            인쇄용
          </button>
        </div>
      </div>
    </div>
  );
}
