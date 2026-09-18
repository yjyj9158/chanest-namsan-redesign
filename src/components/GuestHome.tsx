"use client";

import { Hero } from "@/components/Hero";
import { MinibarSection } from "@/components/MinibarSection";
import { GuestRequestHistory } from "@/components/GuestRequestHistory";
import { GuestServicesSection } from "@/components/GuestServicesSection";
import { StayGuideSection } from "@/components/StayGuideSection";
import { LocalGuideSection } from "@/components/LocalGuideSection";
import { Footer } from "@/components/FloatingConcierge";

export function GuestHome() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <MinibarSection />
      <GuestRequestHistory />
      <GuestServicesSection />
      <StayGuideSection />
      <LocalGuideSection />
      <Footer />
    </main>
  );
}
