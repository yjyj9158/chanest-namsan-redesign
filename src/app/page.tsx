import { Hero } from "@/components/Hero";
import { MinibarSection } from "@/components/MinibarSection";
import { StayGuideSection } from "@/components/StayGuideSection";
import { LocalGuideSection } from "@/components/LocalGuideSection";
import { Footer } from "@/components/FloatingConcierge";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <MinibarSection />
      <StayGuideSection />
      <LocalGuideSection />
      <Footer />
    </main>
  );
}
