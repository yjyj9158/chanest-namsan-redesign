import type { Metadata } from "next";
import { AboutPage } from "@/components/brand/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Why Chanest — a quiet luxury stay beside Namsan, Seoul.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
