import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — THE CHANEST NAMSAN",
  description: "THE CHANEST NAMSAN 운영자 관리 페이지",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-cream font-sans text-charcoal antialiased">
      {children}
    </div>
  );
}
