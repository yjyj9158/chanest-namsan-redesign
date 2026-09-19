import type { Metadata } from "next";
import { DesignersIndex } from "@/components/brand/DesignersPages";

export const metadata: Metadata = {
  title: "Designers",
  description: "The people behind the space — THE CHANEST NAMSAN.",
};

export default function DesignersPage() {
  return <DesignersIndex />;
}
