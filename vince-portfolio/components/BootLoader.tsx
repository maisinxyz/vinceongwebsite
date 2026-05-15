"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "INITIALIZING SYSTEM...",
  "> UNIT: Vince Ong",
  "> DISCIPLINE: Mechatronic Systems Engineering",
  "> STATUS: Available for deployment",
  "> BUILD: v1.0.0 — 2026",
  "SYSTEM READY.",
];

const CHAR_DELAY = 35; // ms per character
const LINE_PAUSE = 200; // ms pause between lines
const FINAL_PAUSE = 600; // ms pause after last line

export default function BootLoader() {
  const [isBooted, setIsBooted] = useState(true); // default to booted (skip)
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const booted = sessionStorage.getItem("system-booted");
      if (booted) {
        setIsBooted(true);
      } else {
        setIsBooted(false);
        // Lock body scroll during boot
        document.body.style.overflow = "hidden";
      }
    }
  }, []);

  // Typing effect
  const typeNextChar = useCallback(() => {
    if (currentLineIndex >= BOOT_LINES.length) {
      // All lines typed — pause then exit
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          sessionStorage.setItem("system-booted", "true");
          document.body.style.overflow = "";
          setIsBooted(true);
        }, 800);
      }, FINAL_PAUSE);
      return;
    }

    const currentLine = BOOT_LINES[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      setDisplayedLines((prev) => {
        const updated = [...prev];
        updated[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
        return updated;
      });
      setCurrentCharIndex((prev) => prev + 1);
    } else {
      // Line complete — move to next line after pause
      setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setDisplayedLines((prev) => [...prev, ""]);
      }, LINE_PAUSE);
      return;
    }
  }, [currentLineIndex, currentCharIndex]);

  useEffect(() => {
    if (isBooted || isExiting) return;

    // Initialize first line
    if (displayedLines.length === 0) {
      setDisplayedLines([""]);
    }

    const timer = setTimeout(typeNextChar, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [isBooted, isExiting, currentCharIndex, currentLineIndex, typeNextChar, displayedLines.length]);

  // Blinking cursor
  useEffect(() => {
    if (isBooted) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [isBooted]);

  if (isBooted) return null;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="bootloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
        >
          <div className="w-full max-w-2xl px-8">
            {/* Terminal window chrome */}
            <div className="mb-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-steel border border-silver/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-steel border border-silver/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-steel border border-silver/30" />
              <span className="ml-3 font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-widest uppercase">
                sys.boot.init
              </span>
            </div>

            {/* Terminal content */}
            <div className="border border-steel/50 bg-void/80 p-6 sm:p-8 font-[family-name:var(--font-ibm-plex-mono-family)]">
              {displayedLines.map((line, index) => (
                <div
                  key={index}
                  className="flex items-center min-h-[1.8em]"
                >
                  <span
                    className={`text-sm sm:text-base ${
                      index === BOOT_LINES.length - 1
                        ? "text-chalk font-medium"
                        : index === 0
                        ? "text-[#C0C0C0]"
                        : "text-[#A0A0A0]"
                    }`}
                  >
                    {line}
                  </span>
                  {/* Blinking cursor on active line */}
                  {index === currentLineIndex && (
                    <span
                      className={`ml-0.5 text-sm sm:text-base text-[#C0C0C0] ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      _
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom status bar */}
            <div className="mt-3 flex justify-between items-center">
              <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/30 tracking-widest">
                VINCE.ONG//PORTFOLIO
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/30 tracking-widest">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="bootloader-exit"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-void"
        />
      )}
    </AnimatePresence>
  );
}
