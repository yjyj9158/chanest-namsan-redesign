"use client";

import { usePathname } from "next/navigation";
import { FloatingConcierge } from "@/components/FloatingConcierge";
import { RequestSubmitBar } from "@/components/RequestSubmitBar";
import { RoomProvider } from "@/context/RoomContext";
import { OrderProvider } from "@/context/OrderContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { parseRoomNumberFromPath } from "@/lib/rooms";

export function GuestProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const roomNumber = parseRoomNumberFromPath(pathname);
  const hideChrome = pathname.includes("/preferences");

  return (
    <LanguageProvider>
      <RoomProvider roomNumber={roomNumber}>
        <OrderProvider>
          {children}
          {hideChrome ? null : (
            <>
              <RequestSubmitBar />
              <FloatingConcierge />
            </>
          )}
        </OrderProvider>
      </RoomProvider>
    </LanguageProvider>
  );
}
