import Link from "next/link";
import { DEFAULT_ROOM_NUMBER } from "@/lib/rooms";

export default function RoomNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-cream px-6 text-center text-charcoal">
      <p className="text-[0.68rem] font-medium tracking-[0.28em] text-gold uppercase">
        THE CHANEST NAMSAN
      </p>
      <h1 className="mt-6 font-serif text-4xl">객실을 찾을 수 없습니다</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        요청하신 객실 번호가 없거나 현재 운영 중이 아닙니다.
      </p>
      <Link
        href={`/r/${DEFAULT_ROOM_NUMBER}`}
        className="mt-8 rounded-full bg-charcoal px-6 py-3 text-sm text-white"
      >
        게스트 가이드로 돌아가기
      </Link>
    </main>
  );
}
