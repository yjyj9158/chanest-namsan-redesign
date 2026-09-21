import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandProviders } from "@/components/brand/BrandProviders";
import { BrandSmoothScroll } from "@/components/brand/BrandSmoothScroll";
import { BrandCursor } from "@/components/brand/BrandCursor";
import { BrandCurtain } from "@/components/brand/BrandCurtain";

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BrandProviders>
      <BrandSmoothScroll>
        <BrandCurtain />
        <BrandCursor />
        <BrandHeader />
        {children}
        <BrandFooter />
      </BrandSmoothScroll>
    </BrandProviders>
  );
}
