import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-cream px-6 text-center text-charcoal">
      <p className="text-[0.68rem] font-medium tracking-[0.28em] text-gold uppercase">
        THE CHANEST NAMSAN
      </p>
      <h1 className="mt-6 font-serif text-4xl">연결이 잠시 끊겼습니다</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        네트워크를 확인한 뒤 다시 시도해 주세요. 주문과 재고는 온라인에서만
        최신 상태로 확인할 수 있습니다.
      </p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Connection lost. Please check your network and try again.
      </p>
      <Link
        href="/r/301"
        className="mt-10 rounded-full bg-charcoal px-6 py-3 text-sm text-cream"
      >
        Retry
      </Link>
    </main>
  );
}
