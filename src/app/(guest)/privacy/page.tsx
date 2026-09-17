import type { Metadata } from "next";
import Link from "next/link";
import { HOST_PHONE_DISPLAY } from "@/lib/hostContacts";

export const metadata: Metadata = {
  title: "개인정보처리방침 — THE CHANEST NAMSAN",
  description: "THE CHANEST NAMSAN 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-cream px-6 py-16 text-charcoal">
      <article className="mx-auto max-w-lg pb-32">
        <p className="text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-[clamp(1.8rem,6vw,2.6rem)] leading-tight">
          THE CHANEST NAMSAN
          <br />
          개인정보처리방침
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          숙박 중 미니바 주문 및 객실 서비스 요청을 처리하기 위해 아래와 같이
          개인정보를 처리합니다.
        </p>

        <section className="mt-10 space-y-8 text-sm leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl">1. 수집하는 개인정보</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>객실 번호</li>
              <li>주문 내역 (미니바 품목, 수량, 금액)</li>
              <li>요청 및 문의 내용</li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">2. 수집 목적</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>미니바 주문 처리 및 객실 서비스 제공</li>
              <li>고객 요청 및 문의 응대</li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">3. 보유 기간</h2>
            <p className="mt-3 text-muted">체크아웃 후 30일 이내 파기</p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">4. 제3자 제공</h2>
            <p className="mt-3 text-muted">
              결제 처리를 위해 PG사(토스페이먼츠)에 최소한의 정보 제공 (결제
              도입 시)
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">5. 정보 주체의 권리</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              <li>본인의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.</li>
              <li>문의: [운영자 연락처] · {HOST_PHONE_DISPLAY}</li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">6. 개인정보 보호책임자</h2>
            <p className="mt-3 text-muted">THE CHANEST NAMSAN 운영팀</p>
          </div>
        </section>

        <Link
          href="/"
          className="mt-12 inline-block text-sm text-gold-dark underline-offset-4 hover:underline"
        >
          ← 게스트 가이드로 돌아가기
        </Link>
      </article>
    </main>
  );
}
