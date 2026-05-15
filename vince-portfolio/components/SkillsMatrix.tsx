"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SKILLS_MATRIX } from "@/lib/utils";

const PROFICIENCY_LEVELS = ["Advanced", "Proficient", "Familiar"] as const;

export default function SkillsMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const categories = Object.keys(SKILLS_MATRIX) as (keyof typeof SKILLS_MATRIX)[];

  const handleMouseEnter = (skillName: string, tooltip: string, e: React.MouseEvent) => {
    setHoveredSkill(skillName);
    setTooltipText(tooltip);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  };

  return (
    <div ref={ref} className="relative">
      {/* Scan line */}
      {isInView && (
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.5, ease: "linear", delay: 0.5 }}
          className="absolute top-0 w-[30%] h-full pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(168,168,168,0.04), transparent)" }}
        />
      )}

      {/* Desktop Grid */}
      <div className="hidden md:block">
        <div className="bg-iron/30 border border-steel/15 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-5 text-left border-b border-r border-steel/10">
                  <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em]">CATEGORY</span>
                </th>
                {PROFICIENCY_LEVELS.map((level) => (
                  <th key={level} className="p-5 text-left border-b border-r border-steel/10 last:border-r-0">
                    <span className="font-[family-name:var(--font-space-mono-family)] text-[9px] text-silver/35 tracking-[0.2em]">{level.toUpperCase()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, catIndex) => (
                <motion.tr
                  key={category}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + catIndex * 0.1, duration: 0.5, ease: [0.25, 0, 0, 1] }}
                  className="border-b border-steel/10 last:border-b-0"
                >
                  <td className="p-5 border-r border-steel/10 align-top">
                    <span className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-sm">{category}</span>
                  </td>
                  {PROFICIENCY_LEVELS.map((level) => {
                    const skills = SKILLS_MATRIX[category][level] || [];
                    return (
                      <td key={level} className="p-5 border-r border-steel/10 last:border-r-0 align-top">
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, si) => (
                            <motion.span
                              key={skill.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : {}}
                              transition={{ delay: 0.5 + catIndex * 0.1 + si * 0.05, duration: 0.3 }}
                              onMouseEnter={(e) => handleMouseEnter(skill.name, skill.tooltip, e)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] tracking-wider rounded-md px-3 py-1.5 cursor-default transition-all duration-200 ${
                                hoveredSkill === skill.name
                                  ? "text-chalk bg-steel/50 border border-silver/30"
                                  : "text-silver/60 bg-steel/15 border border-transparent hover:border-steel/30"
                              }`}
                            >
                              {skill.name}
                            </motion.span>
                          ))}
                          {skills.length === 0 && (
                            <span className="text-steel/30 text-xs font-[family-name:var(--font-ibm-plex-mono-family)]">—</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + catIndex * 0.1, duration: 0.5 }}
            className="bg-iron/30 border border-steel/15 rounded-xl overflow-hidden"
          >
            <div className="p-5 border-b border-steel/10">
              <span className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-sm">{category}</span>
            </div>
            <div className="p-5 space-y-4">
              {PROFICIENCY_LEVELS.map((level) => {
                const skills = SKILLS_MATRIX[category][level] || [];
                if (skills.length === 0) return null;
                return (
                  <div key={level}>
                    <span className="font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/30 tracking-[0.2em] block mb-2">{level.toUpperCase()}</span>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill.name} className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] text-silver/60 bg-steel/15 rounded-md px-3 py-1.5">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredSkill && (
        <div
          className="hidden md:block fixed z-50 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-void border border-steel/30 rounded-lg px-4 py-2 shadow-xl">
            <p className="font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] text-silver/80 whitespace-nowrap">{tooltipText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
