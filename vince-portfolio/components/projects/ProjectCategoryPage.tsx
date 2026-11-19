"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/CustomCursor";
import { Button } from "@/components/primitives/Button";
import { CATEGORIES, categoryHref, listedIn, type ProjectCategory } from "@/lib/data/projects";
import { ProjectCard } from "./ProjectCard";

/* ═══════════════════════════════════════════════════
   PROJECT CATEGORY PAGE
   /projects/hardware and /projects/software: one category's listed projects
   in a grid, with links back to the split page and across to the other side.
   Same frame as /projects so the two read as one section.
   ═══════════════════════════════════════════════════ */
export function ProjectCategoryPage({ category }: { category: ProjectCategory }) {
  const projects = listedIn(category);
  const other = CATEGORIES.find((c) => c !== category) ?? category;

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main
        className="relative max-lg:pt-[clamp(120px,15vw,224px)] lg:pt-48 xl:pt-56 pb-32 min-h-screen lg:pr-[80px]"
        style={{ paddingLeft: "var(--sidenav-gutter)", transition: "padding-left 0.4s cubic-bezier(0.25, 0, 0, 1)" }}
      >
        <div className="max-w-[1400px] mx-auto max-lg:px-[clamp(20px,5vw,96px)] lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="mb-24 lg:mb-32"
          >
            <Button href="/projects" variant="link" leadingIcon={<ArrowLeft />} className="mb-10 text-xs text-subtle hover:text-silver">
              ALL PROJECTS
            </Button>

            <div className="flex items-end gap-4">
              <h1 className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                {category.toUpperCase()}
              </h1>
              <span className="font-[family-name:var(--font-space-mono-family)] text-xs text-subtle tracking-widest mb-1.5 lg:mb-2.5">
                ({String(projects.length).padStart(2, "0")})
              </span>
            </div>
            <div className="h-px bg-silver/15 w-16 mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.25, 0, 0, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <div className="mt-24 flex justify-end border-t border-steel pt-10">
            <Button href={categoryHref(other)} variant="ghost" trailingIcon={<ArrowRight />}>
              {other.toUpperCase()} PROJECTS
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
