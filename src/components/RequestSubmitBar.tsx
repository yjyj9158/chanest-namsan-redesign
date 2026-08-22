"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, MessageSquareText, Send, X } from "lucide-react";
import { hotelData, formatKRW } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { cn } from "@/lib/utils";

const HOST_PHONE = "010-3223-5714";
const HOST_PHONE_TEL = "01032235714";
const KAKAO_URL = "https://pf.kakao.com/";

export function RequestSubmitBar() {
  const { t } = useLanguage();
  const {
    minibarCart,
    minibarTotal,
    minibarItemCount,
    waterQty,
    services,
    note,
    hasAnythingSelected,
    serviceCount,
  } = useOrder();
  const [open, setOpen] = useState(false);

  const message = useMemo(() => {
    const lines: string[] = [];
    lines.push(`[THE CHANEST NAMSAN] Room ${hotelData.room}`);
    lines.push("");

    if (minibarItemCount > 0) {
      lines.push(`■ ${t.minibarTitle}`);
      hotelData.minibarItems.forEach((item) => {
        const qty = minibarCart[item.id] ?? 0;
        if (qty > 0) {
          lines.push(`- ${item.name} x${qty} (${formatKRW(item.price * qty)})`);
        }
      });
      lines.push(`${t.minibarTotal}: ${formatKRW(minibarTotal)}`);
      lines.push("");
    }

    if (waterQty > 0 || Object.values(services).some(Boolean) || note.trim()) {
      lines.push(`■ ${t.serviceTitle}`);
      if (waterQty > 0) lines.push(`- ${t.waterTitle}: ${waterQty}`);
      if (services.towels) lines.push(`- ${t.serviceTowels}`);
      if (services.amenities) lines.push(`- ${t.serviceAmenities}`);
      if (services.housekeeping) lines.push(`- ${t.serviceHousekeeping}`);
      if (services.other) lines.push(`- ${t.serviceOther}`);
      if (note.trim()) lines.push(`- ${t.serviceNoteLabel}: ${note.trim()}`);
      lines.push("");
    }

    lines.push(t.requestFooter);
    return lines.join("\n");
  }, [
    t,
    minibarCart,
    minibarItemCount,
    minibarTotal,
    waterQty,
    services,
    note,
  ]);

  async function openKakao() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* ignore */
    }
    window.open(KAKAO_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {hasAnythingSelected && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-4 bottom-24 left-4 z-40 mx-auto max-w-md"
          >
            <div className="overflow-hidden rounded-2xl border border-charcoal/8 bg-white/95 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <div className="text-[0.62rem] font-medium tracking-widest text-muted uppercase">
                    {t.requestSummary}
                  </div>
                  <div className="font-serif text-xl text-charcoal">
                    {formatKRW(minibarTotal)}
                  </div>
                  <div className="truncate text-xs text-muted-light">
                    {minibarItemCount > 0 && t.itemsSelected(minibarItemCount)}
                    {minibarItemCount > 0 && serviceCount > 0 && " · "}
                    {serviceCount > 0 && t.servicesSelected(serviceCount)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-charcoal px-4 py-3 text-[0.75rem] font-medium tracking-wide text-white transition-colors hover:bg-gold-dark"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t.requestSend}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/50 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t.requestSend}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-charcoal/6 px-5 py-4">
                <div>
                  <div className="font-serif text-xl">{t.requestSend}</div>
                  <p className="mt-0.5 text-xs text-muted">{t.requestChoose}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-muted"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto bg-cream px-5 py-4">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted">
                  {message}
                </pre>
              </div>

              <div className="flex flex-col gap-2 p-5">
                <a
                  href={`sms:${HOST_PHONE_TEL}?body=${encodeURIComponent(message)}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
                  )}
                >
                  <MessageSquareText className="h-4 w-4" />
                  {t.requestViaSms}
                </a>
                <button
                  type="button"
                  onClick={openKakao}
                  className="flex items-center justify-center gap-2 rounded-full border border-charcoal/10 bg-white px-5 py-3.5 text-sm font-medium transition-colors hover:border-gold/40 hover:bg-gold-soft"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.requestViaKakao}
                </button>
                <p className="pt-1 text-center text-[0.68rem] leading-relaxed text-muted-light">
                  {t.requestKakaoHint} · {HOST_PHONE}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
