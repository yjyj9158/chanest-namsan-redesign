"use client";

import Link from "next/link";
import { useBrandCopy } from "@/components/brand/BrandProviders";
import {
  AIRBNB_LISTING_URL,
  GUEST_GUIDE_PATH,
  INSTAGRAM_URL,
} from "@/lib/brandConfig";
import { HOST_PHONE_DISPLAY, HOST_PHONE_SMS } from "@/lib/hostContacts";

export function BrandFooter() {
  const copy = useBrandCopy();

  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <p className="font-serif text-2xl tracking-[0.28em]">THE CHANEST</p>
          <p className="mt-2 text-[0.68rem] tracking-[0.4em] text-gold uppercase">
            Namsan
          </p>
          <p className="mt-8 max-w-xs text-[0.62rem] tracking-[0.22em] text-white/35 uppercase">
            {copy.footer.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-[0.8rem] text-white/70">
          <Link href="/rooms" className="transition-colors hover:text-gold">
            {copy.nav.rooms}
          </Link>
          <Link href="/designers" className="transition-colors hover:text-gold">
            {copy.nav.designers}
          </Link>
          <Link href="/about" className="transition-colors hover:text-gold">
            {copy.nav.about}
          </Link>
          <a
            href={AIRBNB_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            {copy.nav.book}
          </a>
        </div>

        <div className="flex flex-col gap-3 text-[0.8rem] text-white/70">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            {copy.footer.instagram}
          </a>
          <a
            href={`tel:${HOST_PHONE_SMS}`}
            className="transition-colors hover:text-gold"
          >
            {copy.footer.call} · {HOST_PHONE_DISPLAY}
          </a>
          <Link href="/privacy" className="transition-colors hover:text-gold">
            {copy.footer.privacy}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/8 px-6 py-6 text-center md:px-8">
        <Link
          href={GUEST_GUIDE_PATH}
          className="text-[0.62rem] tracking-wide text-white/22 transition-colors hover:text-white/45"
        >
          {copy.footer.alreadyStaying}
        </Link>
      </div>
    </footer>
  );
}
