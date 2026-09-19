"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const STORAGE = {
  guest: "chanest-pwa-banner-hidden",
  admin: "chanest-pwa-banner-hidden-admin",
} as const;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type BannerCopy = {
  banner: string;
  howTo: string;
  install: string;
  dismiss: string;
  title: string;
  ios: string;
  android: string;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

function isMobileBrowser() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* generated only after production build */
    });
  }, []);
  return null;
}

function PwaBanner({
  variant,
  copy,
}: {
  variant: "guest" | "admin";
  copy: BannerCopy;
}) {
  const [visible, setVisible] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (!isMobileBrowser()) return;
    if (window.localStorage.getItem(STORAGE[variant]) === "1") return;
    setVisible(true);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [variant]);

  function dismiss() {
    window.localStorage.setItem(STORAGE[variant], "1");
    setVisible(false);
    setHelpOpen(false);
  }

  async function install() {
    if (!installEvent) {
      setHelpOpen(true);
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") dismiss();
    setInstallEvent(null);
  }

  const canNativeInstall = Boolean(installEvent);
  const placement =
    variant === "admin"
      ? "top-3"
      : "bottom-[5.25rem] sm:bottom-[5.5rem]";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: variant === "admin" ? -12 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: variant === "admin" ? -12 : 12 }}
            className={cn(
              "fixed inset-x-3 z-[52] rounded-2xl border border-charcoal/10 bg-charcoal/95 px-3.5 py-3 text-cream shadow-xl backdrop-blur-md",
              placement,
            )}
          >
            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 text-[0.78rem] leading-relaxed">
                {copy.banner}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={canNativeInstall ? install : () => setHelpOpen(true)}
                  className="rounded-full bg-gold px-3 py-1.5 text-[0.68rem] font-medium tracking-wide text-charcoal"
                >
                  {canNativeInstall ? copy.install : copy.howTo}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label={copy.dismiss}
                  className="grid h-8 w-8 place-items-center rounded-full text-cream/70 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-charcoal/50 p-4 sm:items-center"
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-sm rounded-3xl bg-cream p-6 text-charcoal"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[0.68rem] tracking-[0.22em] text-gold uppercase">
                THE CHANEST
              </p>
              <h2 className="mt-2 font-serif text-2xl">{copy.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {isIos() ? copy.ios : copy.android}
              </p>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="mt-6 w-full rounded-full bg-charcoal py-3 text-sm text-cream"
              >
                {copy.dismiss}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function GuestPwaBanner() {
  const { t } = useLanguage();
  return (
    <PwaBanner
      variant="guest"
      copy={{
        banner: t.pwaBanner,
        howTo: t.pwaHowTo,
        install: t.pwaInstall,
        dismiss: t.pwaDismiss,
        title: t.pwaModalTitle,
        ios: t.pwaIos,
        android: t.pwaAndroid,
      }}
    />
  );
}

export function AdminPwaBanner() {
  return (
    <PwaBanner
      variant="admin"
      copy={{
        banner: "홈 화면에 추가하면 폰에서 앱처럼 관리할 수 있습니다",
        howTo: "방법 보기",
        install: "설치",
        dismiss: "닫기",
        title: "홈 화면에 추가",
        ios: "하단의 공유 버튼을 누른 뒤 「홈 화면에 추가」를 선택하세요.",
        android:
          "브라우저 메뉴에서 「홈 화면에 추가」 또는 「앱 설치」를 선택하세요.",
      }}
    />
  );
}
