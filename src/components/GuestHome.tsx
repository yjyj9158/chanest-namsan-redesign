"use client";

import { Hero } from "@/components/Hero";
import { PreferencesBanner } from "@/components/PreferencesBanner";
import { MinibarSection } from "@/components/MinibarSection";
import { GuestRequestHistory } from "@/components/GuestRequestHistory";
import { MyPreferencesCard } from "@/components/MyPreferencesCard";
import { GuestServicesSection } from "@/components/GuestServicesSection";
import { StayGuideSection } from "@/components/StayGuideSection";
import { LocalGuideSection } from "@/components/LocalGuideSection";
import { Footer } from "@/components/FloatingConcierge";

export function GuestHome() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <PreferencesBanner />
      <MinibarSection />
      <GuestRequestHistory />
      <MyPreferencesCard />
      <GuestServicesSection />
      <StayGuideSection />
      <LocalGuideSection />
      <Footer />
    </main>
  );
}
