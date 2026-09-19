import Image from "next/image";
import { cn } from "@/lib/utils";

export type MediaTone = "charcoal" | "gold" | "cream" | "warm" | "dusk";

const TONES: Record<MediaTone, string> = {
  charcoal:
    "bg-[radial-gradient(ellipse_at_28%_18%,#4a4338_0%,#1a1814_58%,#0e0c0a_100%)]",
  gold: "bg-[radial-gradient(ellipse_at_72%_8%,#c4a57a_0%,#7a6244_42%,#1a1814_100%)]",
  cream:
    "bg-[radial-gradient(ellipse_at_50%_0%,#f7f4ef_0%,#cbb89a_48%,#5c4a38_100%)]",
  warm: "bg-[radial-gradient(ellipse_at_78%_82%,#b8956a_0%,#2e2a25_52%,#1a1814_100%)]",
  dusk: "bg-[radial-gradient(ellipse_at_18%_78%,#3f372c_0%,#1a1814_58%,#0c0b09_100%)]",
};

export function MediaBlock({
  src,
  alt,
  className,
  tone = "charcoal",
  priority = false,
  sizes = "100vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  tone?: MediaTone;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", TONES[tone], className)}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 18px, rgba(247,244,239,0.04) 18px 19px)",
          }}
        />
      )}
    </div>
  );
}
