import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignerDetail } from "@/components/brand/DesignersPages";
import { DESIGNERS, getDesigner } from "@/lib/designers";
import { brandCopy } from "@/i18n/brandCopy";

export function generateStaticParams() {
  return DESIGNERS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = brandCopy.en.designers.people[slug];
  return {
    title: person?.name ?? "Designer",
    description: person?.blurb,
  };
}

export default async function DesignerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const designer = getDesigner(slug);
  if (!designer) notFound();
  return <DesignerDetail designer={designer} />;
}
