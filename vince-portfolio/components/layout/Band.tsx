import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   BAND (CONTRACT 3.3)
   The only way to make a full-bleed coloured section. The band's box starts
   at the gutter (it sits inside <main class="pl-gutter">); its band-bleed
   backdrop reaches back to x=0 so the colour shows through the glass rail.
   ═══════════════════════════════════════════════════ */
export type BandTone = "void" | "carbon" | "iron";

export type BandProps = {
  tone?: BandTone;
  /** Replaces the tone background, e.g. gradients or device-* backdrops. */
  bgClassName?: string;
  as?: "section" | "div";
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  children: React.ReactNode;
};

// Static map so Tailwind sees the full class names.
const TONE_BG: Record<BandTone, string> = { void: "bg-void", carbon: "bg-carbon", iron: "bg-iron" };

export default function Band({
  tone = "void",
  bgClassName,
  as: Tag = "section",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  children,
}: BandProps) {
  return (
    <Tag
      data-band
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative isolate", className)}
    >
      <div aria-hidden="true" data-gutter-exempt data-band-bg className={cn("band-bleed", bgClassName ?? TONE_BG[tone])} />
      {children}
    </Tag>
  );
}
