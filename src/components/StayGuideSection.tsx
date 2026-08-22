"use client";

import { motion } from "framer-motion";
import { Bell, Clock, Thermometer, ScrollText, Wifi } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { CopyButton } from "./CopyButton";
import { hotelData, getGuideByIcon } from "@/data/hotelData";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export function StayGuideSection() {
  const { siteContent, guides, wifi } = hotelData;
  const checkoutGuide = getGuideByIcon(guides, "clock");
  const thermoGuide = getGuideByIcon(guides, "thermo");
  const rulesGuide = getGuideByIcon(guides, "note");

  return (
    <section id="guide" className="bg-cream-dark px-6 py-20">
      <SectionHeader
        eyebrow="Essentials"
        title={siteContent.guideTitle}
        description={siteContent.guideDescription}
        className="mb-10"
      />

      <div className="flex flex-col gap-4">
        {/* Wi-Fi Card */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={cardVariants}
          className="overflow-hidden rounded-2xl border border-charcoal/6 bg-white shadow-sm"
        >
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
              <Wifi className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl">Wi-Fi</h3>
              <div className="mt-4 space-y-3">
                <WifiRow label="Network" value={wifi.network} />
                <WifiRow label="Password" value={wifi.password} isPassword />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Check-out Card */}
        {checkoutGuide && (
          <GuideCard
            index={1}
            icon={<Clock className="h-5 w-5" />}
            title={checkoutGuide.title}
            detail={checkoutGuide.detail}
            highlight="11:00 AM"
          />
        )}

        {/* Heating & Cooling Card */}
        {thermoGuide && (
          <GuideCard
            index={2}
            icon={<Thermometer className="h-5 w-5" />}
            title={thermoGuide.title}
            detail={thermoGuide.detail}
          />
        )}

        {/* House Rules Card */}
        {rulesGuide && (
          <GuideCard
            index={3}
            icon={<ScrollText className="h-5 w-5" />}
            title={rulesGuide.title}
            detail={rulesGuide.detail}
            isList
          />
        )}
      </div>

      {/* Notification banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-start gap-4 rounded-2xl border border-gold/20 bg-gold-soft/50 p-5"
      >
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
        <div>
          <div className="text-sm font-medium">{siteContent.notificationTitle}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {siteContent.notificationText}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function WifiRow({
  label,
  value,
  isPassword = false,
}: {
  label: string;
  value: string;
  isPassword?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3">
      <div>
        <div className="text-[0.65rem] font-medium tracking-widest text-muted uppercase">
          {label}
        </div>
        <div
          className={cn(
            "mt-0.5 text-sm font-medium",
            isPassword && "font-mono tracking-wide"
          )}
        >
          {value}
        </div>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

function GuideCard({
  index,
  icon,
  title,
  detail,
  highlight,
  isList = false,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  detail: string;
  highlight?: string;
  isList?: boolean;
}) {
  const lines = detail.split("\n").filter(Boolean);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardVariants}
      className="overflow-hidden rounded-2xl border border-charcoal/6 bg-white shadow-sm"
    >
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl">{title}</h3>
          {highlight && (
            <div className="mt-2 inline-block rounded-lg bg-charcoal px-3 py-1 font-serif text-lg text-white">
              {highlight}
            </div>
          )}
          {isList ? (
            <ul className="mt-3 space-y-2">
              {lines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {line.replace(/^•\s*/, "")}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 space-y-2">
              {lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-muted">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
