import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandProviders } from "@/components/brand/BrandProviders";

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BrandProviders>
      <BrandHeader />
      {children}
      <BrandFooter />
    </BrandProviders>
  );
}
