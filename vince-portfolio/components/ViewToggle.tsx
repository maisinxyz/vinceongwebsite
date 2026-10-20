"use client";

import { motion } from "framer-motion";

interface ViewToggleProps {
  viewMode: "dynamic" | "static";
  onToggle: (mode: "dynamic" | "static") => void;
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] print:hidden">
      <div
        className="relative flex items-center rounded-full p-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(200,200,210,0.05) 100%)",
          backdropFilter: "blur(28px) saturate(1.8) brightness(1.05)",
          WebkitBackdropFilter: "blur(28px) saturate(1.8) brightness(1.05)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          boxShadow:
            "inset 0 0 16px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Dynamic button */}
        <button
          onClick={() => onToggle("dynamic")}
          className="relative z-10 rounded-full px-5 py-2 transition-colors duration-200"
          style={{
            background:
              viewMode === "dynamic"
                ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(200,200,210,0.08) 100%)"
                : "transparent",
            boxShadow:
              viewMode === "dynamic"
                ? "inset 0 0 8px rgba(255,255,255,0.04), 0 1px 4px rgba(0,0,0,0.15)"
                : "none",
          }}
        >
          <span
            className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] tracking-[0.12em] ${
              viewMode === "dynamic" ? "text-chalk" : "text-silver/40"
            }`}
          >
            DYNAMIC
          </span>
        </button>

        {/* Static button */}
        <button
          onClick={() => onToggle("static")}
          className="relative z-10 rounded-full px-5 py-2 transition-colors duration-200"
          style={{
            background:
              viewMode === "static"
                ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(200,200,210,0.08) 100%)"
                : "transparent",
            boxShadow:
              viewMode === "static"
                ? "inset 0 0 8px rgba(255,255,255,0.04), 0 1px 4px rgba(0,0,0,0.15)"
                : "none",
          }}
        >
          <span
            className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[10px] tracking-[0.12em] ${
              viewMode === "static" ? "text-chalk" : "text-silver/40"
            }`}
          >
            STATIC
          </span>
        </button>
      </div>
    </div>
  );
}
