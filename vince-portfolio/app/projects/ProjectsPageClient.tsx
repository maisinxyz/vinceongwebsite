"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { categoryHref, listedIn, type ProjectCategory } from "@/lib/data/projects";

const HARDWARE_PROJECTS = listedIn("hardware");
const SOFTWARE_PROJECTS = listedIn("software");

/* ═══════════════════════════════════════════════════
   COLUMN HEADER COMPONENT
   The title links to that category's own page (/projects/<category>).
   ═══════════════════════════════════════════════════ */
function ColumnHeader({
  category,
  count,
  delay,
}: {
  category: ProjectCategory;
  count: number;
  delay: number;
}) {
  const label = category.toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0, 0, 1] }}
      className="mb-10"
    >
      <Link
        href={categoryHref(category)}
        className="group mb-3 flex w-fit items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-2xl sm:text-3xl tracking-tight underline-offset-[6px] decoration-1 group-hover:underline">
          {label}
        </h2>
        <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-subtle tracking-widest self-end mb-1">
          ({String(count).padStart(2, "0")})
        </span>
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="self-center text-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chalk"
        />
        <span className="sr-only">: view only {category} projects</span>
      </Link>
      <div className="h-px bg-steel/20" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function ProjectsPageClient() {
  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="relative max-lg:pt-[clamp(120px,15vw,224px)] lg:pt-48 xl:pt-56 pb-32 min-h-screen lg:pr-[80px]" style={{ paddingLeft: "var(--sidenav-gutter)", transition: "padding-left 0.4s cubic-bezier(0.25, 0, 0, 1)" }}>
        {/* ── Page Header ── */}
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-[160px] lg:mb-[220px]"
          >
            <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              PROJECTS
            </h1>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>
        </div>

        {/* ── Split Columns ── */}
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 relative">
            {/* Vertical divider (desktop only) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-silver/20 -translate-x-px" />

            {/* ── LEFT: Hardware Projects ── */}
            <div className="lg:pr-10">
              <ColumnHeader category="hardware" count={HARDWARE_PROJECTS.length} delay={0.1} />
              <div className="flex flex-col gap-[130px]">
                {HARDWARE_PROJECTS.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>

            {/* ── RIGHT: Software Projects ── */}
            <div className="lg:pl-10">
              <ColumnHeader category="software" count={SOFTWARE_PROJECTS.length} delay={0.15} />
              <div className="flex flex-col gap-[130px]">
                {SOFTWARE_PROJECTS.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
