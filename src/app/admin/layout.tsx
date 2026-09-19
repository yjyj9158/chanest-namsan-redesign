import type { Metadata } from "next";

import { AdminPwaChrome } from "./_components/AdminPwaChrome";

export const metadata: Metadata = {
  title: "Admin — THE CHANEST NAMSAN",
  description: "THE CHANEST NAMSAN 운영자 관리 페이지",
  manifest: "/manifest-admin.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CHANEST 관리",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-cream font-sans text-charcoal antialiased">
      <AdminPwaChrome />
      {children}
    </div>
  );
}
