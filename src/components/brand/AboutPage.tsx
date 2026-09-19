"use client";

import { FadeIn } from "@/components/brand/FadeIn";
import { MediaBlock } from "@/components/brand/MediaBlock";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { hotelData } from "@/data/hotelData";
import { AIRBNB_LISTING_URL } from "@/lib/brandConfig";

const { siteContent } = hotelData;

export function AboutPage() {
  const copy = useBrandCopy();

  return (
    <main className="bg-cream pt-28 pb-24">
      <FadeIn className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {copy.about.kicker}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.4rem,7vw,4.4rem)] leading-tight">
          {copy.about.title}
        </h1>
        <p className="mt-8 text-base leading-relaxed text-muted">{copy.about.lead}</p>
      </FadeIn>

      <div className="mx-auto mt-16 max-w-5xl px-6">
        <MediaBlock
          src={siteContent.heroImage}
          alt={copy.about.title}
          className="aspect-[16/9] min-h-[280px]"
          sizes="100vw"
          priority
        />
      </div>

      <div className="mx-auto mt-20 max-w-2xl space-y-10 px-6">
        {copy.about.philosophy.map((p) => (
          <FadeIn key={p.slice(0, 24)}>
            <p className="font-serif text-[1.35rem] leading-relaxed text-charcoal md:text-[1.55rem]">
              {p}
            </p>
          </FadeIn>
        ))}
      </div>

      <div className="mx-auto mt-24 grid max-w-5xl items-center gap-10 px-6 md:grid-cols-2">
        <MediaBlock
          src={siteContent.minibarImage}
          alt={copy.about.whyTitle}
          tone="warm"
          className="aspect-[4/5]"
          sizes="50vw"
        />
        <FadeIn>
          <h2 className="font-serif text-4xl">{copy.about.whyTitle}</h2>
          <p className="mt-6 text-sm leading-[1.9] text-muted">{copy.about.whyBody}</p>
        </FadeIn>
      </div>

      <section className="mx-auto mt-28 max-w-3xl px-6">
        <FadeIn>
          <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
            {copy.about.timelineTitle}
          </p>
        </FadeIn>
        <ol className="mt-12 space-y-12">
          {copy.about.milestones.map((item) => (
            <FadeIn key={item.year}>
              <li className="grid gap-3 border-t border-line pt-8 md:grid-cols-[7rem_1fr]">
                <p className="font-serif text-2xl text-gold">{item.year}</p>
                <div>
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </section>

      <div className="mx-auto mt-24 max-w-5xl px-6">
        <MediaBlock
          src={siteContent.guideImage}
          alt="THE CHANEST NAMSAN"
          tone="dusk"
          className="aspect-[16/8] min-h-[240px]"
          sizes="100vw"
        />
        <div className="mt-12 text-center">
          <a
            href={AIRBNB_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-charcoal px-8 py-3 text-[0.75rem] tracking-[0.2em] text-cream uppercase"
          >
            {copy.nav.book}
          </a>
        </div>
      </div>
    </main>
  );
}
