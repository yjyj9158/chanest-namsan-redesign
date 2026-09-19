"use client";

import Link from "next/link";
import { FadeIn } from "@/components/brand/FadeIn";
import { MediaBlock } from "@/components/brand/MediaBlock";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { useLanguage } from "@/i18n/LanguageContext";
import { hotelData } from "@/data/hotelData";
import { AIRBNB_LISTING_URL } from "@/lib/brandConfig";
import type { RoomInfo } from "@/lib/rooms";

const { siteContent } = hotelData;

function roomName(room: RoomInfo, locale: string) {
  return locale === "ko" ? room.name : room.nameEn || room.name;
}

function roomBlurb(room: RoomInfo, locale: string, fallback: string) {
  if (locale === "en") return room.descriptionEn || room.description || fallback;
  return room.description || room.descriptionEn || fallback;
}

export function RoomsIndex({ rooms }: { rooms: RoomInfo[] }) {
  const copy = useBrandCopy();
  const { locale } = useLanguage();
  const coming = [
    { ...copy.rooms.comingSoonA, image: siteContent.serviceImage, tone: "dusk" as const },
    { ...copy.rooms.comingSoonB, image: siteContent.guideImage, tone: "warm" as const },
  ];

  return (
    <main className="bg-cream pt-28 pb-24">
      <FadeIn className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {copy.rooms.kicker}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.4rem,7vw,4.2rem)]">{copy.rooms.title}</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
          {copy.rooms.indexIntro}
        </p>
      </FadeIn>

      <div className="mx-auto mt-16 max-w-5xl space-y-20 px-6">
        {rooms.map((room) => {
          const name = roomName(room, locale);
          const blurb = roomBlurb(room, locale, copy.rooms.fallbackBlurb);
          return (
            <FadeIn key={room.roomNumber}>
              <article className="grid items-center gap-10 md:grid-cols-2">
                <Link href={`/rooms/${room.roomNumber}`} className="block">
                  <MediaBlock
                    src={room.heroImage || siteContent.heroImage}
                    alt={name}
                    className="aspect-[4/5] md:aspect-[3/4]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </Link>
                <div>
                  <h2 className="font-serif text-4xl">{name}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{blurb}</p>
                  <p className="mt-5 text-[0.78rem] tracking-wide text-charcoal/70">
                    {copy.rooms.capacity} {room.capacity}
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-muted">
                    {copy.rooms.amenities.slice(0, 5).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/rooms/${room.roomNumber}`}
                      className="rounded-full px-5 py-2.5 text-[0.72rem] tracking-[0.16em] text-charcoal uppercase ring-1 ring-charcoal/15"
                    >
                      {copy.rooms.view}
                    </Link>
                    <a
                      href={AIRBNB_LISTING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-charcoal px-5 py-2.5 text-[0.72rem] tracking-[0.16em] text-cream uppercase"
                    >
                      {copy.rooms.book}
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          );
        })}

        {coming.map((item) => (
          <FadeIn key={item.name}>
            <article className="grid items-center gap-10 opacity-90 md:grid-cols-2">
              <MediaBlock
                src={item.image}
                alt={item.name}
                tone={item.tone}
                className="aspect-[4/5] md:aspect-[3/4]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div>
                <p className="text-[0.65rem] tracking-[0.28em] text-gold uppercase">
                  {copy.rooms.comingSoon}
                </p>
                <h2 className="mt-3 font-serif text-4xl">{item.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.blurb}</p>
                <p className="mt-6 text-sm text-muted-light">{copy.rooms.comingSoonHint}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}

export function RoomDetail({ room }: { room: RoomInfo }) {
  const copy = useBrandCopy();
  const { locale } = useLanguage();
  const name = roomName(room, locale);
  const blurb = roomBlurb(room, locale, copy.rooms.fallbackBlurb);
  const gallery = [
    room.heroImage || siteContent.heroImage,
    siteContent.minibarImage,
    siteContent.guideImage,
    siteContent.serviceImage,
  ];

  return (
    <main className="bg-cream pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/rooms"
          className="text-[0.72rem] tracking-[0.16em] text-gold uppercase"
        >
          ← {copy.rooms.back}
        </Link>
        <FadeIn className="mt-8">
          <h1 className="font-serif text-[clamp(2.4rem,7vw,4.4rem)]">{name}</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {copy.rooms.detailIntro}
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-3 px-6 md:grid-cols-2">
        {gallery.map((src, i) => (
          <MediaBlock
            key={`${src}-${i}`}
            src={src}
            alt={name}
            className={i === 0 ? "aspect-[4/5] md:col-span-2 md:aspect-[16/9]" : "aspect-[4/3]"}
            sizes={i === 0 ? "100vw" : "50vw"}
            priority={i === 0}
          />
        ))}
      </div>

      <FadeIn className="mx-auto mt-16 max-w-3xl px-6">
        <p className="text-base leading-[1.9] text-charcoal/80">{blurb}</p>
        <p className="mt-4 text-sm text-muted">
          {copy.rooms.capacity} {room.capacity}
        </p>
        <h2 className="mt-12 font-serif text-3xl">{copy.rooms.amenitiesTitle}</h2>
        <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
          {copy.rooms.amenities.map((item) => (
            <li key={item} className="border-t border-line pt-3">
              {item}
            </li>
          ))}
        </ul>
        <a
          href={AIRBNB_LISTING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex rounded-full bg-charcoal px-7 py-3 text-[0.75rem] tracking-[0.18em] text-cream uppercase"
        >
          {copy.rooms.book}
        </a>
      </FadeIn>
    </main>
  );
}
