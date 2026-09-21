"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/brand/FadeIn";
import { MediaBlock } from "@/components/brand/MediaBlock";
import { ClipReveal } from "@/components/brand/ClipReveal";
import { Intro3D } from "@/components/brand/Intro3D";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import { useLanguage } from "@/i18n/LanguageContext";
import { DESIGNERS } from "@/lib/designers";
import { hotelData } from "@/data/hotelData";
import { useBrandSrc } from "@/lib/brandAssets";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapBrand";
import {
  AIRBNB_LISTING_URL,
  BRAND_ADDRESS_EN,
  BRAND_ADDRESS_KO,
} from "@/lib/brandConfig";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";
import type { RoomInfo } from "@/lib/rooms";

function LockupLine({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={`${ch}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span data-letter className="inline-block will-change-transform">
            {ch === " " ? "\u00a0" : ch}
          </span>
        </span>
      ))}
    </p>
  );
}

function HomeHero() {
  const copy = useBrandCopy();
  const src = useBrandSrc("hero");
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const img = imgWrap.current?.querySelector("img");
      if (reduced) {
        if (img) gsap.set(img, { scale: 1 });
        return;
      }
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.15 },
          { scale: 1, duration: 2, ease: "power2.out" },
        );
        gsap.to(img, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -96,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "68% top",
            scrub: true,
          },
        });
      }
      const letters = root.current?.querySelectorAll("[data-letter]");
      if (letters?.length) {
        gsap.fromTo(
          letters,
          { y: "110%" },
          {
            y: "0%",
            duration: 1.55,
            ease: "power3.out",
            stagger: 0.04,
            delay: 0.12,
          },
        );
      }
    },
    { scope: root, dependencies: [reduced, src] },
  );

  return (
    <section ref={root} className="relative h-svh min-h-[640px] overflow-hidden">
      <div ref={imgWrap} className="absolute inset-0">
        <MediaBlock
          src={src}
          alt={hotelData.siteContent.heroImageAlt}
          priority
          className="absolute inset-0"
          imageClassName="will-change-transform"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/25" />
      <div
        ref={textRef}
        className="relative flex h-full flex-col justify-end px-6 pb-16 md:justify-center md:px-16 md:pb-0"
      >
        <LockupLine
          text="THE CHANEST"
          className="font-serif text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.92] tracking-[0.18em] text-white"
        />
        <LockupLine
          text="NAMSAN"
          className="mt-3 font-serif text-[clamp(1.4rem,4vw,2.4rem)] tracking-[0.46em] text-gold"
        />
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
        <span className="brand-scroll-line" />
      </div>
    </section>
  );
}

function HomeIntro() {
  const copy = useBrandCopy();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const line1 = copy.intro.line1.split(/\s+/).filter(Boolean);
  const line2 = copy.intro.line2.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const spans = root.current?.querySelectorAll("[data-word]");
      if (!spans?.length) return;
      if (reduced) {
        gsap.set(spans, { opacity: 1, filter: "blur(0px)" });
        return;
      }
      gsap.fromTo(
        spans,
        { opacity: 0.15, filter: "blur(8px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            end: "center 42%",
            scrub: true,
          },
        },
      );
    },
    { scope: root, dependencies: [reduced, copy.intro.line1, copy.intro.line2] },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto min-h-[70vh] max-w-4xl overflow-hidden px-6 py-28 text-center md:py-40"
    >
      <Intro3D />
      <div className="relative z-10">
        <p className="font-serif text-[clamp(1.7rem,5vw,2.85rem)] leading-snug text-charcoal">
          {line1.map((word, i) => (
            <span key={`l1-${i}`} data-word className="inline-block pr-[0.28em]">
              {word}
            </span>
          ))}
          <br />
          {line2.map((word, i) => (
            <span key={`l2-${i}`} data-word className="inline-block pr-[0.28em]">
              {word}
            </span>
          ))}
        </p>
        <p className="mt-10 whitespace-pre-line text-[0.95rem] leading-[1.9] text-muted">
          {copy.intro.body}
        </p>
      </div>
    </section>
  );
}

function RoomCard({
  href,
  src,
  name,
  blurb,
  label,
  comingSoon,
}: {
  href?: string;
  src: string;
  name: string;
  blurb: string;
  label: string;
  comingSoon?: boolean;
}) {
  const inner = (
    <>
      <ClipReveal>
        <MediaBlock
          src={src}
          alt={name}
          className="aspect-[4/5]"
          sizes="(min-width: 768px) 38vw, 100vw"
          imageClassName="origin-center transition-transform duration-[800ms] ease-out group-hover:scale-105"
        />
      </ClipReveal>
      <p className="mt-5 font-serif text-2xl">{name}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{blurb}</p>
      <span
        className={cn(
          "mt-4 inline-block text-[0.72rem] tracking-[0.2em] uppercase",
          comingSoon ? "text-gold/80" : "text-gold",
        )}
      >
        {label}
        {!comingSoon && " →"}
      </span>
    </>
  );

  const className =
    "group block w-full shrink-0 md:w-[min(72vw,420px)]";

  if (href) {
    return (
      <Link href={href} className={className} data-cursor="view">
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

function HomeRooms({ rooms }: { rooms: RoomInfo[] }) {
  const copy = useBrandCopy();
  const { locale } = useLanguage();
  const coming = [copy.rooms.comingSoonA, copy.rooms.comingSoonB];
  const garden = useBrandSrc("garden");
  const suite = useBrandSrc("suite02");
  const hero = useBrandSrc("hero");
  const comingImages = [garden, suite];
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !desktop || !track.current || !section.current) return;
      const getDistance = () =>
        Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => `+=${getDistance()}`,
        },
      });
    },
    { scope: section, dependencies: [desktop, reduced, rooms.length] },
  );

  return (
    <section ref={section} className="relative overflow-hidden pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-6 pt-4 md:px-10">
        <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {copy.rooms.kicker}
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{copy.rooms.title}</h2>
      </div>
      <div className="mt-12 overflow-hidden">
        <div
          ref={track}
          className="flex flex-col gap-10 px-6 will-change-transform md:w-max md:flex-row md:items-start md:gap-12 md:px-10 md:py-10"
        >
          {rooms.map((room) => {
            const name = locale === "ko" ? room.name : room.nameEn || room.name;
            const blurb =
              locale === "en"
                ? room.descriptionEn || room.description || copy.rooms.fallbackBlurb
                : room.description || room.descriptionEn || copy.rooms.fallbackBlurb;
            return (
              <RoomCard
                key={room.roomNumber}
                href={`/rooms/${room.roomNumber}`}
                src={room.heroImage || hero}
                name={name}
                blurb={blurb}
                label={copy.rooms.view}
              />
            );
          })}
          {coming.map((item, i) => (
            <RoomCard
              key={item.name}
              src={comingImages[i]}
              name={item.name}
              blurb={item.blurb}
              label={copy.rooms.comingSoon}
              comingSoon
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeExperience() {
  const copy = useBrandCopy();
  const images = [
    useBrandSrc("detail1"),
    useBrandSrc("detail2"),
    useBrandSrc("texture"),
  ];
  const section = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (!section.current) return;
      ScrollColor(section.current, reduced);

      if (reduced || !desktop) return;
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(2, Math.floor(self.progress * 0.999 * 3));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    },
    { scope: section, dependencies: [desktop, reduced] },
  );

  return (
    <section
      ref={section}
      className="brand-experience relative md:h-[300vh]"
    >
      <div className="md:sticky md:top-0 md:flex md:h-svh md:items-stretch">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-24 md:grid md:grid-cols-2 md:gap-16 md:px-10 md:py-0">
          <div className="relative flex flex-col justify-center">
            <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              {copy.experience.kicker}
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              {copy.experience.title}
            </h2>
            <div className="relative mt-12 min-h-[9.5rem] md:min-h-[12rem]">
              {copy.experience.items.map((item, i) => (
                <div
                  key={item.title}
                  className={cn(
                    desktop
                      ? "absolute inset-0 transition-opacity duration-700 ease-out"
                      : "relative mb-12 last:mb-0",
                    desktop ? (active === i ? "opacity-100" : "opacity-0") : "opacity-100",
                  )}
                >
                  <p className="font-serif text-2xl leading-snug md:text-3xl">
                    {item.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed opacity-70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-6 hidden min-h-[70vh] overflow-hidden md:block">
            {images.map((src, i) => (
              <div
                key={src}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-out",
                  active === i ? "opacity-100" : "opacity-0",
                )}
              >
                <MediaBlock
                  src={src}
                  alt={copy.experience.items[i]?.title ?? ""}
                  className="h-full min-h-[70vh]"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-6 md:hidden">
            {copy.experience.items.map((item, i) => (
              <FadeIn key={`m-${item.title}`}>
                <MediaBlock
                  src={images[i]}
                  alt={item.title}
                  className="aspect-[4/5]"
                  sizes="100vw"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollColor(section: HTMLElement, reduced: boolean) {
  if (reduced) {
    section.style.setProperty("--exp", "0");
    return;
  }
  ScrollTrigger.create({
    trigger: section,
    start: "top 75%",
    end: "bottom 30%",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      let exp = 1;
      if (p < 0.18) exp = p / 0.18;
      else if (p > 0.82) exp = (1 - p) / 0.18;
      section.style.setProperty("--exp", String(Math.max(0, Math.min(1, exp))));
    },
  });
}

function HomeDesigners() {
  const copy = useBrandCopy();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const portraits = [
    useBrandSrc("detail1"),
    useBrandSrc("texture"),
    useBrandSrc("garden"),
  ];

  useGSAP(
    () => {
      if (reduced || !desktop) return;
      const cards = root.current?.querySelectorAll("[data-designer-card]");
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: i % 2 === 0 ? 48 : 96 },
          {
            y: i % 2 === 0 ? -16 : 24,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "bottom 18%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced, desktop] },
  );

  return (
    <section ref={root} className="bg-cream px-6 py-28 md:px-10">
      <div className="mx-auto mb-12 flex max-w-6xl items-end justify-between gap-6">
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
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        {DESIGNERS.map((d, i) => {
          const person = copy.designers.people[d.slug];
          return (
            <Link
              key={d.slug}
              href={`/designers/${d.slug}`}
              data-designer-card
              data-cursor="view"
              className="group block"
            >
              <MediaBlock
                src={portraits[i]}
                tone={d.tone}
                alt={person.name}
                className="mx-auto aspect-[3/4] max-w-[280px] rounded-[40%] md:max-w-none md:rounded-none"
                sizes="(min-width: 768px) 33vw, 70vw"
                imageClassName="grayscale origin-center transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <p className="mt-5 font-serif text-2xl">{person.name}</p>
              <p className="mt-1 text-[0.72rem] tracking-[0.16em] text-gold uppercase">
                {person.field}
              </p>
              <p className="mt-3 text-sm text-muted">{copy.designers.comingSoon}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HomeLocation() {
  const copy = useBrandCopy();
  const { locale } = useLanguage();
  const src = useBrandSrc("location");
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const img = imgWrap.current?.querySelector("img");
      const lines = root.current?.querySelectorAll("[data-landmark]");
      if (!reduced && img) {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
      const goldLines = root.current?.querySelectorAll("[data-gold-line]");
      if (lines?.length) {
        if (reduced) {
          gsap.set(lines, { opacity: 1 });
          if (goldLines?.length) gsap.set(goldLines, { scaleX: 1 });
          return;
        }
        if (goldLines?.length) {
          gsap.fromTo(
            goldLines,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 0.9,
              ease: "power2.out",
              stagger: 0.12,
              scrollTrigger: { trigger: root.current, start: "top 70%" },
            },
          );
        }
        gsap.fromTo(
          lines,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          },
        );
      }
    },
    { scope: root, dependencies: [reduced, src] },
  );

  return (
    <section ref={root} className="relative min-h-[90svh] overflow-hidden">
      <div ref={imgWrap} className="absolute inset-0">
        <MediaBlock
          src={src}
          alt={copy.location.title}
          tone="dusk"
          className="absolute inset-0 min-h-[90svh]"
          sizes="100vw"
          imageClassName="will-change-transform"
        />
      </div>
      <div className="absolute inset-0 bg-charcoal/50" />
      <div className="relative z-10 flex min-h-[90svh] items-end px-8 py-16 text-cream md:px-16 md:py-24">
        <div className="max-w-xl">
          <p className="text-[0.68rem] tracking-[0.28em] text-gold uppercase">
            {copy.location.kicker}
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{copy.location.title}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
            {copy.location.body}
          </p>
          <p className="mt-8 text-[0.62rem] tracking-[0.22em] text-gold uppercase">
            {copy.location.addressLabel}
          </p>
          <p className="mt-2 text-sm text-white/80">
            {locale === "ko" ? BRAND_ADDRESS_KO : BRAND_ADDRESS_EN}
          </p>
          <ul className="mt-10 space-y-4">
            {copy.location.landmarks.map((place) => (
              <li key={place} data-landmark className="flex items-center gap-4">
                <span
                  data-gold-line
                  className="h-px w-10 origin-left bg-gold"
                />
                <span className="text-[0.78rem] tracking-[0.08em] text-white/70">
                  {place}
                </span>
              </li>
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
        </div>
      </div>
    </section>
  );
}

export function BrandHome({ rooms }: { rooms: RoomInfo[] }) {
  return (
    <main className="brand-shell bg-cream">
      <HomeHero />
      <HomeIntro />
      <HomeRooms rooms={rooms} />
      <HomeExperience />
      <HomeDesigners />
      <HomeLocation />
    </main>
  );
}
