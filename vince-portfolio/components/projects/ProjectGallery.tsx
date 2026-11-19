"use client";

import RevealOnScroll from "@/components/RevealOnScroll";
import { getProject, type ProjectSlug } from "@/lib/data/projects";
import { ProjectMediaView } from "./ProjectMediaView";

/* ═══════════════════════════════════════════════════
   PROJECT GALLERY
   A masonry of the project's `gallery` photos and clips, each at its own
   aspect ratio, so portrait phone clips and landscape photos sit together.
   Renders nothing when the project has no gallery.
   ═══════════════════════════════════════════════════ */
const WRAP = "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12";

export function ProjectGallery({ slug, title = "GALLERY" }: { slug: ProjectSlug; title?: string }) {
  const items = getProject(slug).gallery ?? [];
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={`${slug}-gallery`} className={`${WRAP} border-t border-steel py-16 sm:py-24`}>
      <RevealOnScroll>
        <h2 id={`${slug}-gallery`} className="mb-10 font-[family-name:var(--font-syne-family)] text-3xl font-bold tracking-tight text-chalk sm:text-4xl">
          {title}
        </h2>
      </RevealOnScroll>

      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {items.map((m, i) => (
          <li key={m.src ?? i} className="mb-6 break-inside-avoid">
            <RevealOnScroll delay={(i % 3) * 0.08}>
              <figure>
                <div className="overflow-hidden rounded-xl border border-steel bg-void">
                  <ProjectMediaView media={m} fit="natural" />
                </div>
                {m.caption && (
                  <figcaption className="mt-3 font-[family-name:var(--font-ibm-plex-mono-family)] text-xs text-subtle">{m.caption}</figcaption>
                )}
              </figure>
            </RevealOnScroll>
          </li>
        ))}
      </ul>
    </section>
  );
}
