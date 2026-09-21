"use client";

import Link from "next/link";
import { FadeIn } from "@/components/brand/FadeIn";
import { MediaBlock } from "@/components/brand/MediaBlock";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { DESIGNERS, type DesignerProfile } from "@/lib/designers";
import { hotelData } from "@/data/hotelData";
import { DEFAULT_ROOM_NUMBER } from "@/lib/rooms";

export function DesignersIndex() {
  const copy = useBrandCopy();

  return (
    <main className="bg-cream pt-28 pb-24">
      <FadeIn className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {copy.designers.kicker}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.2rem,6.5vw,4rem)] leading-tight">
          {copy.designers.subtitle}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
          {copy.designers.indexIntro}
        </p>
      </FadeIn>

      <div className="mx-auto mt-20 grid max-w-6xl gap-12 px-6 md:grid-cols-3">
        {DESIGNERS.map((d, i) => {
          const person = copy.designers.people[d.slug];
          return (
            <FadeIn key={d.slug} delay={i * 0.08}>
              <Link href={`/designers/${d.slug}`} className="group block" data-cursor="view">
                <MediaBlock
                  tone={d.tone}
                  alt={person.name}
                  className="aspect-[3/4]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  imageClassName="grayscale origin-center transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <p className="mt-6 font-serif text-3xl">{person.name}</p>
                <p className="mt-1 text-[0.72rem] tracking-[0.16em] text-gold uppercase">
                  {person.field}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{person.blurb}</p>
                <span className="mt-5 inline-block text-[0.72rem] tracking-[0.18em] text-gold uppercase">
                  {copy.designers.interview} →
                </span>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </main>
  );
}

export function DesignerDetail({ designer }: { designer: DesignerProfile }) {
  const copy = useBrandCopy();
  const person = copy.designers.people[designer.slug];

  return (
    <main className="bg-cream pt-28 pb-24">
      <div className="mx-auto grid max-w-6xl items-end gap-10 px-6 md:grid-cols-[1.1fr_1fr]">
        <MediaBlock
          tone={designer.tone}
          alt={person.name}
          className="aspect-[3/4] min-h-[420px]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <FadeIn>
          <Link
            href="/designers"
            className="text-[0.72rem] tracking-[0.16em] text-gold uppercase"
          >
            ← {copy.designers.viewAll}
          </Link>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,7vw,4.4rem)] leading-none">
            {person.name}
          </h1>
          <p className="mt-4 text-[0.78rem] tracking-[0.2em] text-gold uppercase">
            {person.field}
          </p>
          <p className="mt-8 text-sm leading-relaxed text-muted">{person.blurb}</p>
        </FadeIn>
      </div>

      <FadeIn className="mx-auto mt-20 max-w-3xl px-6">
        <blockquote className="border-l border-gold/50 pl-6 font-serif text-[clamp(1.4rem,3.5vw,2.1rem)] leading-snug text-charcoal">
          {person.quote}
        </blockquote>
      </FadeIn>

      <div className="mx-auto mt-20 max-w-3xl space-y-14 px-6">
        {person.interview.map((item, i) => (
          <FadeIn key={item.q} delay={i * 0.05}>
            <p className="text-[0.72rem] tracking-[0.14em] text-gold">{item.q}</p>
            <p className="mt-4 text-[0.98rem] leading-[1.9] text-charcoal/85">{item.a}</p>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mx-auto mt-24 max-w-3xl px-6">
        <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {copy.designers.involved}
        </p>
        <Link href={`/rooms/${DEFAULT_ROOM_NUMBER}`} className="mt-6 flex items-center gap-6">
          <MediaBlock
            src={hotelData.siteContent.heroImage}
            alt="301"
            className="h-24 w-20 shrink-0"
            sizes="80px"
          />
          <div>
            <p className="font-serif text-2xl">301</p>
            <p className="mt-1 text-sm text-muted">{copy.rooms.view} →</p>
          </div>
        </Link>
      </FadeIn>
    </main>
  );
}
