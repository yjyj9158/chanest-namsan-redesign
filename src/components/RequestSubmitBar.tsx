"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, MessageSquareText, X } from "lucide-react";
import { hotelData, formatKRW } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import {
  HOST_KAKAO_OPEN_CHAT,
  HOST_PHONE_DISPLAY,
  HOST_PHONE_SMS,
} from "@/lib/hostContacts";
import { sendNotify } from "@/lib/notify";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function RequestSubmitBar() {
  const { t } = useLanguage();
  const {
    minibarItems,
    minibarCart,
    minibarTotal,
    minibarItemCount,
    waterQty,
    services,
    note,
    hasAnythingSelected,
    selectedCount,
  } = useOrder();
  const [open, setOpen] = useState(false);

  const message = useMemo(() => {
    const lines: string[] = [];
    lines.push(`[THE CHANEST NAMSAN] Room ${hotelData.room}`);
    lines.push("");

    if (minibarItemCount > 0) {
      lines.push(`■ ${t.minibarTitle}`);
      minibarItems.forEach((item) => {
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
      if (waterQty > 0) lines.push(`- ${t.waterTitle}: x${waterQty} (${t.waterFree})`);
      if (services.towels) lines.push(`- ${t.serviceTowels}`);
      if (services.amenities) lines.push(`- ${t.serviceAmenities}`);
      if (services.housekeeping) lines.push(`- ${t.serviceHousekeeping}`);
      if (services.other) lines.push(`- ${t.serviceOther}`);
      if (note.trim()) lines.push(`- ${t.serviceNoteLabel}: ${note.trim()}`);
      lines.push("");
    }

    lines.push(t.requestFooter);
    return lines.join("\n");
  }, [t, minibarItems, minibarCart, minibarItemCount, minibarTotal, waterQty, services, note]);

  const smsHref = `sms:${HOST_PHONE_SMS}?body=${encodeURIComponent(message)}`;
  const savedKeyRef = useRef<string | null>(null);

  function currentRequestKey() {
    return JSON.stringify({
      minibarCart,
      waterQty,
      services,
      note,
      minibarTotal,
    });
  }

  async function persistToSupabase(): Promise<{
    orderId?: string;
    requestIds: string[];
  }> {
    const minibarCartItems = minibarItems
      .filter((item) => (minibarCart[item.id] ?? 0) > 0)
      .map((item) => ({
        name: item.name,
        qty: minibarCart[item.id] ?? 0,
        price: item.price,
      }));

    const serviceParts: string[] = [];
    if (waterQty > 0) serviceParts.push(`추가 생수 ×${waterQty}`);
    if (services.towels) serviceParts.push("추가 타월");
    if (services.amenities) serviceParts.push("어메니티 요청");
    if (services.housekeeping) serviceParts.push("하우스키핑");
    if (services.other) serviceParts.push("기타 요청");
    const servicesSummaryText = serviceParts.join(", ");
    const hasServices = serviceParts.length > 0;
    const hasOnlyServices = minibarCartItems.length === 0 && hasServices;

    let orderId: string | undefined;
    const requestIds: string[] = [];

    if (minibarCartItems.length > 0 || hasServices) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          room: hotelData.room,
          items: minibarCartItems,
          total: minibarTotal,
          note: note.trim() || null,
          type: hasOnlyServices ? "amenity" : "order",
          status: "new",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) orderId = String(data.id);
    }

    if (hasServices) {
      const { data, error } = await supabase
        .from("requests")
        .insert({
          room: hotelData.room,
          message: servicesSummaryText,
          type: "amenity",
          status: "unanswered",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) requestIds.push(String(data.id));
    }

    if (note.trim()) {
      const { data, error } = await supabase
        .from("requests")
        .insert({
          room: hotelData.room,
          message: note.trim(),
          type: "question",
          status: "unanswered",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) requestIds.push(String(data.id));
    }

    return { orderId, requestIds };
  }

  function handleOpenRequest() {
    const key = currentRequestKey();
    if (savedKeyRef.current !== key) {
      savedKeyRef.current = key;
      void (async () => {
        try {
          const ids = await persistToSupabase();
          void sendNotify(message, {
            orderId: ids.orderId,
            requestId: ids.requestIds[0],
            requestIds: ids.requestIds,
          });
        } catch {
          savedKeyRef.current = null;
          void sendNotify(message);
        }
      })();
    }
    setOpen(true);
  }

  async function openKakao() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* ignore */
    }
    window.open(HOST_KAKAO_OPEN_CHAT, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {hasAnythingSelected && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[55]"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="border-t border-charcoal/8 bg-white/95 shadow-[0_-8px_32px_rgba(26,24,20,0.12)] backdrop-blur-xl">
              <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[0.78rem] font-medium text-charcoal">
                      {t.selectedCount(selectedCount)}
                    </span>
                    <span className="text-muted-light">|</span>
                    <span className="font-serif text-lg leading-none text-charcoal">
                      {formatKRW(minibarTotal)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenRequest}
                  className="shrink-0 rounded-full bg-charcoal px-3.5 py-3 text-[0.72rem] font-medium tracking-wide whitespace-nowrap text-white transition-colors hover:bg-gold-dark sm:px-5 sm:text-[0.78rem]"
                >
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
                  href={smsHref}
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
                  {t.requestKakaoHint}
                  <br />
                  SMS · {HOST_PHONE_DISPLAY}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
