import { FloatingConcierge } from "@/components/FloatingConcierge";
import { RequestSubmitBar } from "@/components/RequestSubmitBar";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { OrderProvider } from "@/context/OrderContext";

/** 고객용 페이지 전용 chrome — /admin 에는 적용되지 않음 */
export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <OrderProvider>
        {children}
        <RequestSubmitBar />
        <FloatingConcierge />
      </OrderProvider>
    </LanguageProvider>
  );
}
