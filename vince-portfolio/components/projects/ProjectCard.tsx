"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { projectHref, type Project } from "@/lib/data/projects";
import { ProjectMediaView } from "./ProjectMediaView";

/* ═══════════════════════════════════════════════════
   PROJECT CARD
   The /projects list card, shared by the split page and the category pages.
   Links to the detail page, else to the first external link, else nowhere.
   ═══════════════════════════════════════════════════ */
const MONO = "font-[family-name:var(--font-ibm-plex-mono-family)]";

function cardTarget(p: Project): { href: string; external: boolean; label: string } | null {
  const detail = projectHref(p.slug);
  if (detail) return { href: detail, external: false, label: "VIEW DETAILS" };
  const link = p.links[0];
  return link ? { href: link.href, external: true, label: "VIEW PROJECT" } : null;
}

export function ProjectCard({ project }: { project: Project }) {
  const target = cardTarget(project);
  const frame = (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-lg bg-void/50",
        project.media.kind === "component" ? "aspect-[480/380]" : "aspect-[3/2]",
      )}
    >
      <ProjectMediaView media={project.media} />
    </div>
  );
  const linkProps = target?.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
      className="group rounded-xl border border-steel/12 p-6 transition-colors duration-300 hover:border-silver/20"
    >
      {target ? (
        <Link href={target.href} {...linkProps} className="block" tabIndex={-1} aria-hidden="true">
          {frame}
        </Link>
      ) : (
        frame
      )}

      <div className="space-y-2.5">
        <h3 className="font-[family-name:var(--font-syne-family)] text-base font-bold tracking-tight text-chalk">{project.title}</h3>

        <p className={`${MONO} text-[10px] leading-[1.8] text-subtle`}>{project.summary}</p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`${MONO} rounded-full bg-steel/8 px-2 py-0.5 text-[7px] tracking-wider text-subtle`}>
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className={`${MONO} rounded-full bg-steel/8 px-2 py-0.5 text-[7px] tracking-wider text-subtle`}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {target && (
          <Link
            href={target.href}
            {...linkProps}
            className={`${MONO} inline-flex items-center gap-1.5 pt-1 text-[9px] text-subtle transition-colors hover:text-chalk`}
          >
            {target.label}
            <span className="sr-only">: {project.title}</span>
            <ArrowRight size={9} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
