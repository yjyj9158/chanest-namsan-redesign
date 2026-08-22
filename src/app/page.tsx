"use client";

import { Hero } from "@/components/Hero";
import { MinibarSection } from "@/components/MinibarSection";
import { GuestServicesSection } from "@/components/GuestServicesSection";
import { StayGuideSection } from "@/components/StayGuideSection";
import { LocalGuideSection } from "@/components/LocalGuideSection";
import { Footer } from "@/components/FloatingConcierge";
import { RequestSubmitBar } from "@/components/RequestSubmitBar";
import { OrderProvider } from "@/context/OrderContext";

export default function Home() {
  return (
    <OrderProvider>
      <main className="overflow-x-hidden">
        <Hero />
        <MinibarSection />
        <GuestServicesSection />
        <StayGuideSection />
        <LocalGuideSection />
        <Footer />
      </main>
      <RequestSubmitBar />
    </OrderProvider>
  );
}
