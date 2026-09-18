import { GuestProviders } from "@/components/GuestProviders";

/** 고객용 페이지 전용 chrome — /admin 에는 적용되지 않음 */
export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GuestProviders>{children}</GuestProviders>;
}
