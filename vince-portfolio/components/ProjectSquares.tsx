"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SQUARE_PROJECTS = [
  {
    title: "AUTOMATIC SPICE DISPENSER",
    description: "A precision mechatronic system engineered to automatically dispense spices with extreme accuracy. Integrates stepper motor control, custom PCB design, and a 3D-printed chassis.",
    href: "/projects#automatic-spice-dispenser",
  },
  {
    title: "ENGRAM",
    description: "An AI-powered SaaS platform leveraging semantic data pipelines and RAG architecture. Built with Next.js, Supabase, and advanced vector search capabilities.",
    href: "/projects#engram",
  },
  {
    title: "DIGITAL DICE",
    description: "An embedded systems project featuring a custom PCB, microcontroller programming, and a sleek physical interface for digital randomization.",
    href: "/projects#digital-dice",
  },
];

export function ProjectSquares() {
  return (
    <section className="relative min-h-[100vh] w-full bg-void flex items-center justify-center py-24 sm:py-32 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 lg:px-32">
        
        {/* Section Header */}
        <div className="-mt-24 sm:-mt-32 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
            className="font-[family-name:var(--font-syne-family)] font-extrabold text-chalk text-3xl sm:text-4xl tracking-tight"
          >
            FEATURED PROJECTS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0, 0, 1] }}
            className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/40 text-xs tracking-[0.2em] mt-4"
          >
            CLICK TO EXPLORE
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mt-32 sm:mt-48">
          {SQUARE_PROJECTS.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0, 0, 1] }}
            >
              <Link href={project.href} className="block w-full outline-none focus:outline-none">
                {/* 
                  Square Container 
                  aspect-square ensures perfect boxes.
                  group enables hover targeting for children.
                  hover:-translate-y-2 is the "pop-up" effect.
                  hover:shadow-... is the "backlight" glow effect.
                */}
                <div className="relative w-full aspect-square bg-[#0c0c0c] border border-silver/15 rounded-2xl p-8 flex flex-col justify-between group transition-all duration-500 ease-out hover:-translate-y-2 hover:border-silver/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] overflow-hidden">
                  
                  {/* Inner subtle glow gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top Content: Title */}
                  <div className="relative z-10 flex justify-between items-start gap-4">
                    <h3 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-xl sm:text-2xl leading-tight tracking-tight uppercase group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-silver/5 border border-silver/10 flex items-center justify-center shrink-0 group-hover:bg-chalk group-hover:text-void group-hover:border-chalk transition-all duration-300">
                      <ArrowRight size={14} className="text-silver/50 group-hover:text-void group-hover:-rotate-45 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Bottom Content: Description */}
                  <div className="relative z-10 mt-auto pt-6 border-t border-silver/10 group-hover:border-silver/20 transition-colors duration-300">
                    <p className="font-[family-name:var(--font-inter-family)] text-silver/50 text-sm leading-relaxed group-hover:text-silver/80 transition-colors duration-300">
                      {project.description}
                    </p>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
