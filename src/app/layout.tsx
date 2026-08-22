import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { FloatingConcierge } from "@/components/FloatingConcierge";
import { RequestSubmitBar } from "@/components/RequestSubmitBar";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { OrderProvider } from "@/context/OrderContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE CHANEST NAMSAN — Digital Guest Guide",
  description: "더 채네스트 남산 디지털 게스트 가이드북",
};

export const viewport: Viewport = {
  themeColor: "#1a1814",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <OrderProvider>
            {children}
            <RequestSubmitBar />
            <FloatingConcierge />
          </OrderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
