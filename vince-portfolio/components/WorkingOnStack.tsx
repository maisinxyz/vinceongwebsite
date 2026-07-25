"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const WORKING_ON_PROJECTS = [
  {
    title: "Engram",
    description: "Idea: Build a B2B AI SaaS platform. Needs to have LLM-powered persistent memory for enterprise workflows. Crucial for team adoption.",
    notes: "Notes: Tech stack will be Next.js + TypeScript. Must handle complex state.",
    tags: ["NEXT.JS", "TYPESCRIPT", "AI/LLM"],
    status: "In Progress",
    href: "https://engram-pi-ruddy.vercel.app",
    period: "2024 —",
  },
  {
    title: "DAWNTRACE",
    description: "Goal: Autonomous robotic platform. Need to design the custom PCB from scratch and write all the embedded firmware.",
    notes: "Challenges: Sensor fusion in C/C++. Gotta keep latency low!",
    tags: ["C/C++", "PCB", "FIRMWARE"],
    status: "In Progress",
    href: "https://github.com/maisinxyz/DAWNTRACE",
    period: "2025 —",
  },
];

export default function WorkingOnStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = WORKING_ON_PROJECTS.length;

  return (
    <div className="w-full flex flex-col items-start">
      <div className="relative w-full h-[320px] sm:h-[360px] max-w-3xl perspective-[1200px]">
        {WORKING_ON_PROJECTS.map((project, index) => {
          const offset = (index - activeIndex + total) % total;
          const isActive = offset === 0;

          const cardContent = (
            <div
              className={`w-full h-full border border-steel/30 rounded-md overflow-hidden relative transition-all duration-200 ${
                isActive
                  ? "hover:border-steel/50 hover:-translate-y-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                  : "shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              }`}
              style={{
                backgroundColor: "var(--color-iron)",
                backgroundImage: `
                  linear-gradient(90deg, transparent 59px, rgba(58,107,138,0.3) 59px, rgba(58,107,138,0.3) 61px, transparent 61px),
                  repeating-linear-gradient(transparent, transparent 39px, rgba(168,168,168,0.1) 39px, rgba(168,168,168,0.1) 40px)
                `,
                backgroundPosition: "0 0",
              }}
            >
              <div className="absolute inset-0 pl-[80px] pr-8 pb-4 flex flex-col">
                {/* Header Row */}
                <div className="h-[40px] flex items-end justify-between pb-[6px]">
                  <h3 className="font-[family-name:var(--font-ibm-plex-mono-family)] font-bold text-chalk text-lg sm:text-xl tracking-tight leading-none">
                    {project.title}
                  </h3>
                  <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] tracking-[0.15em] text-silver/40 leading-none">
                    DATE: {project.period}
                  </span>
                </div>
                
                {/* Description Body */}
                <div className="flex-1 mt-[40px]">
                  <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/70 text-[13px] sm:text-[14px] leading-[40px]">
                    {project.description}
                  </p>
                  {project.notes && (
                    <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-silver/50 text-[13px] sm:text-[14px] leading-[40px]">
                      {project.notes}
                    </p>
                  )}
                </div>

                {/* Footer Row */}
                <div className="h-[40px] flex items-end justify-between pb-[6px]">
                  <div className="flex flex-wrap gap-4">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/50 tracking-[0.15em] leading-none"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  {project.href && (
                    <a 
                      href={project.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[12px] text-accent hover:text-chalk transition-colors leading-none pb-1"
                    >
                      ( open repo → )
                    </a>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <motion.div
              key={index}
              className="absolute inset-0 cursor-pointer"
              animate={{
                y: offset * 12,
                x: offset * 8,
                rotate: offset * 1.5,
                scale: 1 - offset * 0.03,
                zIndex: total - offset,
              }}
              transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % total);
              }}
              style={{ pointerEvents: isActive ? "auto" : "auto" }}
            >
              <div className="w-full h-full">{cardContent}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center gap-3 mt-12 pl-[80px]">
        {WORKING_ON_PROJECTS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              activeIndex === index ? "bg-chalk" : "bg-steel/30 hover:bg-silver/40"
            }`}
            aria-label={`View project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
