import type { Metadata } from "next";
import { GuestProviders } from "@/components/GuestProviders";

export const metadata: Metadata = {
  title: "Guest Guide",
  description: "THE CHANEST NAMSAN digital guest guide",
};

/** 게스트 컨시어지 chrome — /r/* 에서만 적용 */
export default function GuestRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GuestProviders>{children}</GuestProviders>;
}
