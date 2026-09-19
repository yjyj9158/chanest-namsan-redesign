export type DesignerTone = "warm" | "charcoal" | "gold";

export type DesignerProfile = {
  slug: string;
  tone: DesignerTone;
};

export const DESIGNERS: DesignerProfile[] = [
  { slug: "seoyeon", tone: "warm" },
  { slug: "junho", tone: "charcoal" },
  { slug: "harin", tone: "gold" },
];

export function getDesigner(slug: string): DesignerProfile | undefined {
  return DESIGNERS.find((d) => d.slug === slug);
}
