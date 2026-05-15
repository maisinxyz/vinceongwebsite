"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
}

export default function ProjectCard({
  project,
  index = 0,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0, 0, 1],
      }}
      className={featured ? "md:col-span-2" : ""}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative bg-iron/40 border border-steel/20 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-silver/25 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-void/40">
          {/* Accent bar */}
          <div
            className="h-0.5 w-full rounded-t-xl"
            style={{ backgroundColor: project.accentColor || "#A8A8A8", opacity: 0.5 }}
          />

          {/* Content */}
          <div className="p-7 sm:p-9">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl tracking-tight">
                  {project.title}
                </h3>
                <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-xs mt-1.5">
                  {project.tagline}
                </p>
              </div>

              {/* Year badge */}
              <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/40 tracking-widest bg-steel/30 rounded-md px-2.5 py-1 shrink-0 ml-4">
                {project.year}
              </span>
            </div>

            {/* Description — shorter */}
            <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/45 text-sm leading-relaxed mb-6 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/45 tracking-wider bg-steel/20 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    project.status === "ACTIVE"
                      ? "bg-green-500/70 animate-pulse-dot"
                      : "bg-silver/25"
                  }`}
                />
                <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/30 tracking-widest">
                  {project.status}
                </span>
              </div>

              {/* Arrow */}
              <div className="w-8 h-8 rounded-full border border-steel/20 flex items-center justify-center text-silver/30 group-hover:border-silver/40 group-hover:text-chalk group-hover:bg-steel/30 transition-all duration-300">
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
