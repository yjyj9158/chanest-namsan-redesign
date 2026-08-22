"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={cn(centered && "text-center", className)}
    >
      <span className="mb-2.5 block text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase">
        {eyebrow}
      </span>
      <h2 className="font-serif text-[clamp(1.75rem,5vw,2.4rem)] leading-tight font-normal">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-md text-[0.92rem] leading-relaxed font-light text-muted",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
