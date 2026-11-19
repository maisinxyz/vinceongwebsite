"use client";

import { DigitalDicePCB } from "@/components/DigitalDicePCB";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProjectMedia } from "@/lib/data/projects";

/* ═══════════════════════════════════════════════════
   PROJECT MEDIA VIEW
   One renderer for a ProjectMedia item: list cards, detail screens and galleries.
   `fit="cover"` fills a fixed frame (cards, screens); `fit="natural"` keeps the
   item's own aspect (galleries). Videos are silent loops; under reduced motion
   they stop autoplaying and show their controls instead.
   ═══════════════════════════════════════════════════ */
export function ProjectMediaView({
  media,
  fit = "cover",
  className,
}: {
  media: ProjectMedia;
  fit?: "cover" | "natural";
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const fill = fit === "cover" ? "absolute inset-0 h-full w-full object-cover" : "block h-auto w-full";

  if (media.kind === "video" && media.src) {
    return (
      <video
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        className={cn(fill, className)}
        autoPlay={!reduced}
        controls={reduced}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  if (media.kind === "image" && media.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.src} alt={media.alt} loading="lazy" decoding="async" className={cn(fill, className)} />
    );
  }

  if (media.kind === "component") {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center bg-[#101722]", className)}>
        <DigitalDicePCB className="!max-w-none w-full" />
      </div>
    );
  }

  return <Placeholder media={media} className={className} />;
}

/**
 * A detail page's ProjectShell screen. Landscape media fills the frame; portrait media
 * (phone clips) is shown whole, centred over a blurred copy of its poster so the frame
 * never crops it.
 */
export function ProjectHeroScreen({ media }: { media: ProjectMedia }) {
  if (media.orientation !== "portrait") return <ProjectMediaView media={media} />;
  const backdrop = media.poster ?? (media.kind === "image" ? media.src : undefined);
  return (
    <>
      {backdrop && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backdrop} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
      )}
      <ProjectMediaView media={media} className="object-contain" />
    </>
  );
}

function Placeholder({ media, className }: { media: ProjectMedia; className?: string }) {
  return (
    <div role="img" aria-label={media.alt} className={cn("absolute inset-0 flex items-center justify-center bg-iron/30", className)}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,168,168,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,168,168,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-silver/10">
          <div className="h-3.5 w-3.5 rounded-sm border border-silver/15" />
        </div>
        <p className="font-[family-name:var(--font-space-mono-family)] text-[8px] tracking-[0.3em] text-subtle">COMING SOON</p>
      </div>
    </div>
  );
}
