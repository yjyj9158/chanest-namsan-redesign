"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hotelData, formatKRW } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { sendNotify } from "@/lib/notify";
import { supabase } from "@/lib/supabase";

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
    resetAll,
  } = useOrder();
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<"success" | "error" | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const savedKeyRef = useRef<string | null>(null);

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

  function showToast(kind: "success" | "error") {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast(kind);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  }

  function handleSend() {
    if (sending) return;
    const key = currentRequestKey();
    if (savedKeyRef.current === key) return;
    const outgoing = message;
    savedKeyRef.current = key;
    setSending(true);
    void (async () => {
      try {
        const ids = await persistToSupabase();
        const notified = await sendNotify(outgoing, {
          orderId: ids.orderId,
          requestId: ids.requestIds[0],
          requestIds: ids.requestIds,
        });
        if (!notified) {
          savedKeyRef.current = null;
          showToast("error");
          return;
        }
        resetAll();
        showToast("success");
      } catch {
        savedKeyRef.current = null;
        showToast("error");
      } finally {
        setSending(false);
      }
    })();
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
                  onClick={handleSend}
                  disabled={sending}
                  className="shrink-0 rounded-full bg-charcoal px-3.5 py-3 text-[0.72rem] font-medium tracking-wide whitespace-nowrap text-white transition-colors hover:bg-gold-dark disabled:opacity-50 sm:px-5 sm:text-[0.78rem]"
                >
                  {t.requestSend}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast ? (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 top-8 z-[80] flex justify-center px-4"
        >
          <div className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-charcoal shadow-[0_8px_24px_rgba(26,24,20,0.18)]">
            {toast === "success" ? t.requestToastSuccess : t.requestToastError}
          </div>
        </div>
      ) : null}
    </>
  );
}
