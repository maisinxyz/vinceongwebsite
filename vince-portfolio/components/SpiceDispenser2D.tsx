"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpiceDispenser2D() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hopperOpen, setHopperOpen] = useState(false);
  const [status, setStatus] = useState("IDLE");

  const handleDispense = () => {
    if (isSpinning || isCalibrating) return;
    setIsSpinning(true);
    setStatus("DISPENSING...");
    setTimeout(() => {
      setIsSpinning(false);
      setStatus("DISPENSE COMPLETE");
      setTimeout(() => setStatus("IDLE"), 2000);
    }, 1200);
  };

  const handleCalibrate = () => {
    if (isSpinning || isCalibrating) return;
    setIsCalibrating(true);
    setStatus("CALIBRATING...");
    setTimeout(() => {
      setIsCalibrating(false);
      setStatus("CALIBRATION COMPLETE");
      setTimeout(() => setStatus("IDLE"), 2000);
    }, 3000);
  };

  const handleReset = () => {
    setIsSpinning(false);
    setIsCalibrating(false);
    setHopperOpen(false);
    setStatus("RESET");
    setTimeout(() => setStatus("IDLE"), 1000);
  };

  const handleToggleHopper = () => {
    setHopperOpen(!hopperOpen);
    setStatus(hopperOpen ? "HOPPER CLOSED" : "HOPPER OPENED");
    setTimeout(() => setStatus("IDLE"), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 2D Canvas */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-void border border-steel/30 overflow-hidden viewer-3d flex items-center justify-center line-grid-bg">
        
        {/* SVG Illustration - Flavourinator */}
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-[80%]" overflow="visible">
          
          {/* --- TOP: HOPPER TUBES --- */}
          {/* Left Tube */}
          <rect x="50" y="20" width="24" height="70" fill="#4a4a4a" stroke="var(--color-steel)" strokeWidth="1" opacity="0.8" />
          <motion.g
            style={{ transformOrigin: "62px 20px" }}
            animate={{ rotate: hopperOpen ? -30 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
          >
            <rect x="48" y="10" width="28" height="12" rx="2" fill="#6b4c3a" stroke="var(--color-steel)" strokeWidth="1" />
          </motion.g>

          {/* Center Tube */}
          <rect x="88" y="20" width="24" height="70" fill="#5a4d40" stroke="var(--color-steel)" strokeWidth="1" opacity="0.8" />
          <motion.g
            style={{ transformOrigin: "100px 20px" }}
            animate={{ rotate: hopperOpen ? -30 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
          >
            <rect x="86" y="10" width="28" height="12" rx="2" fill="#6b4c3a" stroke="var(--color-steel)" strokeWidth="1" />
          </motion.g>

          {/* Right Tube */}
          <rect x="126" y="20" width="24" height="70" fill="#4a4a4a" stroke="var(--color-steel)" strokeWidth="1" opacity="0.8" />
          <motion.g
            style={{ transformOrigin: "138px 20px" }}
            animate={{ rotate: hopperOpen ? -30 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
          >
            <rect x="124" y="10" width="28" height="12" rx="2" fill="#6b4c3a" stroke="var(--color-steel)" strokeWidth="1" />
          </motion.g>


          {/* --- MOTOR BLOCK --- */}
          <rect x="40" y="90" width="120" height="40" rx="2" fill="#2a2a2a" stroke="var(--color-steel)" strokeWidth="1" />
          
          {/* 3 Circular Indents / Motor Faces */}
          {[62, 100, 138].map((cx, i) => (
            <motion.g
              key={i}
              style={{ transformOrigin: `${cx}px 110px` }}
              animate={{
                rotate: (i === 1 && isSpinning) ? 360 * 3 : (i === 1 && isCalibrating) ? [0, -30, 30, -30, 30, 0] : 0
              }}
              transition={{
                duration: isSpinning ? 1.2 : isCalibrating ? 3 : 0.5,
                ease: isSpinning ? "linear" : "easeInOut",
                repeat: isCalibrating ? Infinity : 0
              }}
            >
              <circle cx={cx} cy="110" r="14" fill="#1f1f1f" stroke="#333" strokeWidth="1" />
              {/* Inner detail to show rotation */}
              <line x1={cx - 10} y1="110" x2={cx + 10} y2="110" stroke="#444" strokeWidth="1.5" />
            </motion.g>
          ))}


          {/* --- SHELF / DISPENSE AREA --- */}
          {/* Back wall of shelf */}
          <rect x="45" y="130" width="110" height="40" fill="#111" />
          {/* Left/Right walls */}
          <rect x="40" y="130" width="5" height="40" fill="#2a2a2a" stroke="var(--color-steel)" strokeWidth="1" />
          <rect x="155" y="130" width="5" height="40" fill="#2a2a2a" stroke="var(--color-steel)" strokeWidth="1" />
          
          {/* The Cup */}
          <path d="M 75 145 L 125 145 L 120 170 L 80 170 Z" fill="#ffffff" opacity="0.15" stroke="#fff" strokeWidth="0.5" />
          <ellipse cx="100" cy="145" rx="25" ry="3" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />

          {/* Particles (Dispensing into cup) */}
          <AnimatePresence>
            {isSpinning && Array.from({ length: 12 }).map((_, i) => (
              <motion.circle
                key={i}
                cx="100"
                cy="135"
                r="1.5"
                fill="#8b6b4a"
                initial={{ opacity: 1, y: 0, x: (Math.random() - 0.5) * 10 }}
                animate={{ opacity: 0, y: 25 + Math.random() * 10 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeIn"
                }}
              />
            ))}
          </AnimatePresence>


          {/* --- BOTTOM BASE (LCD & BUTTON) --- */}
          <rect x="40" y="170" width="120" height="55" rx="2" fill="#222" stroke="var(--color-steel)" strokeWidth="1" />
          
          {/* Red LED / Button */}
          <circle cx="65" cy="195" r="5" fill={isSpinning || isCalibrating ? "#ff3333" : "#551111"} />
          <circle cx="65" cy="195" r="2" fill="#fff" opacity="0.4" />

          {/* LCD Screen */}
          <rect x="85" y="185" width="60" height="18" fill="#00bfff" stroke="#007acc" strokeWidth="1" />
          {/* LCD Text */}
          <text x="88" y="193" fill="#003366" fontSize="6" fontFamily="monospace" fontWeight="bold">Spice 1</text>
          <text x="88" y="200" fill="#003366" fontSize="6" fontFamily="monospace" fontWeight="bold">Dill Weed</text>

          {/* FLAVOURINATOR Label */}
          <rect x="75" y="210" width="80" height="10" rx="2" fill="#fff" />
          <text x="115" y="217" fill="#333" fontSize="6" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">FLAVOURINATOR</text>

        </svg>

      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "DISPENSE", action: handleDispense, active: isSpinning },
          { label: "CALIBRATE", action: handleCalibrate, active: isCalibrating },
          { label: "RESET", action: handleReset, active: false },
          {
            label: hopperOpen ? "CLOSE HOPPER" : "OPEN HOPPER",
            action: handleToggleHopper,
            active: hopperOpen,
          },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-[11px] tracking-wider px-4 py-3 border transition-all duration-200 ${
              btn.active
                ? "border-silver/60 text-chalk bg-steel/40"
                : "border-steel/40 text-silver/60 hover:border-silver/40 hover:text-chalk"
            }`}
          >
            [ {btn.label} ]
          </button>
        ))}
      </div>

      {/* Status LCD Display */}
      <div className="bg-void border border-steel/30 px-5 py-3 flex items-center gap-2">
        <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-silver/40 tracking-widest">
          STATUS:
        </span>
        <span className="font-[family-name:var(--font-space-mono-family)] text-[11px] text-chalk tracking-widest">
          {status}
        </span>
        <span className="animate-blink text-chalk text-sm ml-0.5">_</span>
      </div>
    </div>
  );
}
