"use client";

import Link from "next/link";
import { FadeIn } from "@/components/brand/FadeIn";
import { MediaBlock } from "@/components/brand/MediaBlock";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { useLanguage } from "@/i18n/LanguageContext";
import { hotelData } from "@/data/hotelData";
import { DESIGNERS } from "@/lib/designers";
import {
  AIRBNB_LISTING_URL,
  BRAND_ADDRESS_EN,
  BRAND_ADDRESS_KO,
} from "@/lib/brandConfig";
import type { RoomInfo } from "@/lib/rooms";

const { siteContent } = hotelData;

export function BrandHome({ rooms }: { rooms: RoomInfo[] }) {
  const copy = useBrandCopy();
  const { locale } = useLanguage();
  const coming = [copy.rooms.comingSoonA, copy.rooms.comingSoonB];
  const comingImages = [siteContent.serviceImage, siteContent.guideImage];
  const comingTones = ["dusk", "warm"] as const;

  return (
    <main>
      <section className="relative h-svh min-h-[640px] overflow-hidden">
        <MediaBlock
          src={siteContent.heroImage}
          alt={siteContent.heroImageAlt}
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/25" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 md:justify-center md:px-16 md:pb-0">
          <p className="font-serif text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.92] tracking-[0.18em] text-white">
            THE CHANEST
          </p>
          <p className="mt-3 font-serif text-[clamp(1.4rem,4vw,2.4rem)] tracking-[0.46em] text-gold">
            NAMSAN
          </p>
          <p className="mt-10 max-w-md text-[0.82rem] tracking-[0.14em] text-white/80 md:text-sm">
            {copy.hero.tagline}
          </p>
          <p className="mt-2 text-[0.9rem] text-white/70 md:text-base">
            {copy.hero.taglineLocal}
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50">
          <span className="text-[0.58rem] tracking-[0.32em] uppercase">
            {copy.hero.scroll}
          </span>
          <span className="h-8 w-px animate-pulse bg-white/40" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <FadeIn>
          <p className="font-serif text-[clamp(1.7rem,5vw,2.85rem)] leading-snug text-charcoal">
            {copy.intro.line1}
            <br />
            {copy.intro.line2}
          </p>
          <p className="mt-10 whitespace-pre-line text-[0.95rem] leading-[1.9] text-muted">
            {copy.intro.body}
          </p>
        </FadeIn>
      </section>

      <section className="px-6 pb-24 md:px-10">
        <FadeIn className="mx-auto mb-12 max-w-6xl">
          <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
            {copy.rooms.kicker}
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{copy.rooms.title}</h2>
        </FadeIn>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {rooms.map((room, i) => {
            const name = locale === "ko" ? room.name : room.nameEn || room.name;
            const blurb =
              locale === "en"
                ? room.descriptionEn || room.description || copy.rooms.fallbackBlurb
                : room.description || room.descriptionEn || copy.rooms.fallbackBlurb;
            return (
              <FadeIn key={room.roomNumber} delay={i * 0.08}>
                <Link href={`/rooms/${room.roomNumber}`} className="group block">
                  <MediaBlock
                    src={room.heroImage || siteContent.heroImage}
                    alt={name}
                    className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.01]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <p className="mt-5 font-serif text-2xl">{name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {blurb}
                  </p>
                  <span className="mt-4 inline-block text-[0.72rem] tracking-[0.2em] text-gold uppercase">
                    {copy.rooms.view} →
                  </span>
                </Link>
              </FadeIn>
            );
          })}
          {coming.map((item, i) => (
            <FadeIn key={item.name} delay={(rooms.length + i) * 0.08}>
              <div>
                <MediaBlock
                  src={comingImages[i]}
                  alt={item.name}
                  tone={comingTones[i]}
                  className="aspect-[4/5]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <p className="mt-5 font-serif text-2xl">{item.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.blurb}</p>
                <span className="mt-4 inline-block text-[0.72rem] tracking-[0.2em] text-gold/80 uppercase">
                  {copy.rooms.comingSoon}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-cream-dark/40 px-6 py-28 md:py-32">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
            {copy.experience.kicker}
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{copy.experience.title}</h2>
        </FadeIn>
        <div className="mx-auto mt-16 grid max-w-4xl gap-16 md:grid-cols-3 md:gap-10">
          {copy.experience.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1} className="text-center md:text-left">
              <p className="font-serif text-2xl leading-snug">{item.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{item.body}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 md:px-10">
        <FadeIn className="mx-auto mb-12 flex max-w-6xl items-end justify-between gap-6">
          <div>
            <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              {copy.designers.kicker}
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{copy.designers.title}</h2>
          </div>
          <Link
            href="/designers"
            className="shrink-0 text-[0.72rem] tracking-[0.18em] text-gold uppercase"
          >
            {copy.designers.viewAll} →
          </Link>
        </FadeIn>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          {DESIGNERS.map((d, i) => {
            const person = copy.designers.people[d.slug];
            return (
              <FadeIn key={d.slug} delay={i * 0.08}>
                <Link href={`/designers/${d.slug}`} className="group block">
                  <MediaBlock
                    tone={d.tone}
                    alt={person.name}
                    className="mx-auto aspect-[3/4] max-w-[280px] rounded-[40%] md:max-w-none md:rounded-none"
                    sizes="(min-width: 768px) 33vw, 70vw"
                  />
                  <p className="mt-5 font-serif text-2xl">{person.name}</p>
                  <p className="mt-1 text-[0.72rem] tracking-[0.16em] text-gold uppercase">
                    {person.field}
                  </p>
                  <p className="mt-3 text-sm text-muted">{copy.designers.comingSoon}</p>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <MediaBlock
          src={siteContent.contactImage}
          alt={copy.location.title}
          tone="dusk"
          className="min-h-[420px] md:min-h-[560px]"
          sizes="50vw"
        />
        <div className="flex flex-col justify-center bg-charcoal px-8 py-16 text-cream md:px-16">
          <FadeIn>
            <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              {copy.location.kicker}
            </p>
            <h2 className="mt-4 font-serif text-4xl">{copy.location.title}</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
              {copy.location.body}
            </p>
            <p className="mt-8 text-[0.62rem] tracking-[0.22em] text-gold uppercase">
              {copy.location.addressLabel}
            </p>
            <p className="mt-2 text-sm text-white/80">
              {locale === "ko" ? BRAND_ADDRESS_KO : BRAND_ADDRESS_EN}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] text-white/45">
              {copy.location.landmarks.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
            <a
              href={AIRBNB_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit rounded-full bg-cream px-6 py-3 text-[0.72rem] tracking-[0.18em] text-charcoal uppercase"
            >
              {copy.nav.book}
            </a>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
