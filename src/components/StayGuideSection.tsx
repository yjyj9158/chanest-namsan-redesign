"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  KeyRound,
  Phone,
  ScrollText,
  Thermometer,
  TrainFront,
  Wifi,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { CopyButton } from "./CopyButton";
import { hotelData } from "@/data/hotelData";
import { useLanguage } from "@/i18n/LanguageContext";
import { HOST_PHONE_DISPLAY } from "@/lib/hostContacts";
import { cn } from "@/lib/utils";

const HOSPITAL_PHONE = "02-2260-7114";
const POLICE = "112";
const FIRE = "119";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export function StayGuideSection() {
  const { wifi, doorLockPassword } = hotelData;
  const { t } = useLanguage();

  return (
    <section id="guide" className="bg-cream-dark px-6 py-20">
      <SectionHeader
        eyebrow={t.guideEyebrow}
        title={t.guideTitle}
        description={t.guideDescription}
        className="mb-10"
      />

      <div className="flex flex-col gap-4">
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
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl">{t.checkinTitle}</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <GuideLabel>🔑 {t.doorLockPassword}</GuideLabel>
                  <div className="mt-2">
                    <WifiRow label={t.password} value={doorLockPassword} isPassword />
                  </div>
                </div>
                <div>
                  <GuideLabel>📍 {t.directions}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted whitespace-pre-line">
                    {t.checkinDirectionsDetail}
                  </p>
                </div>
                <div>
                  <GuideLabel>🅿️ {t.parking}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.checkinParkingDetail}
                  </p>
                </div>
                <div>
                  <GuideLabel>🧳 {t.luggageStorage}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.checkinLuggageDetail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          custom={1}
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
              <h3 className="font-serif text-xl">{t.wifiTitle}</h3>
              <div className="mt-4 space-y-3">
                <WifiRow label={t.network} value={wifi.network} />
                <WifiRow label={t.password} value={wifi.password} isPassword />
              </div>
            </div>
          </div>
        </motion.div>

        <GuideCard
          index={2}
          icon={<Clock className="h-5 w-5" />}
          title={t.checkoutTitle}
          detail={t.checkoutDetail}
          highlight="11:00 AM"
        />

        <GuideCard
          index={3}
          icon={<Thermometer className="h-5 w-5" />}
          title={t.thermoTitle}
          detail={t.thermoDetail}
        />

        <GuideCard
          index={4}
          icon={<ScrollText className="h-5 w-5" />}
          title={t.rulesTitle}
          detail={t.rulesDetail}
          isList
        />

        <motion.div
          custom={5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={cardVariants}
          className="overflow-hidden rounded-2xl border border-charcoal/6 bg-white shadow-sm"
        >
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
              <TrainFront className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl">{t.transportTitle}</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <GuideLabel>🚇 {t.nearestStation}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.nearestStationDetail}
                  </p>
                </div>
                <div>
                  <GuideLabel>{t.gettingAround}</GuideLabel>
                  <ul className="mt-2 space-y-2">
                    {t.gettingAroundDetail.split("\n").filter(Boolean).map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {line.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <GuideLabel>🚕 {t.taxi}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.taxiDetail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          custom={6}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={cardVariants}
          className="overflow-hidden rounded-2xl border border-charcoal/6 bg-white shadow-sm"
        >
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-dark">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl">{t.emergencyTitle}</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <GuideLabel>🚨 {t.emergencyCall}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.emergencyPolice}{" "}
                    <TelLink phone={POLICE} />
                    {" · "}
                    {t.emergencyFire}{" "}
                    <TelLink phone={FIRE} />
                  </p>
                </div>
                <div>
                  <GuideLabel>🏥 {t.nearestHospital}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.nearestHospitalDetail}
                  </p>
                  <TelLink phone={HOSPITAL_PHONE} className="mt-1 inline-flex" />
                </div>
                <div>
                  <GuideLabel>💊 {t.nearestPharmacy}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t.nearestPharmacyDetail}
                  </p>
                </div>
                <div>
                  <GuideLabel>📞 {t.hostEmergencyContact}</GuideLabel>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    <TelLink phone={HOST_PHONE_DISPLAY} /> {t.hostEmergencyHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-start gap-4 rounded-2xl border border-gold/20 bg-gold-soft/50 p-5"
      >
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
        <div>
          <div className="text-sm font-medium">{t.notificationTitle}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {t.notificationText}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function GuideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.72rem] font-medium tracking-wide text-charcoal">
      {children}
    </div>
  );
}

function TelLink({
  phone,
  className,
}: {
  phone: string;
  className?: string;
}) {
  const href = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-gold-dark underline-offset-2 hover:underline",
        className,
      )}
    >
      {phone}
    </a>
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
