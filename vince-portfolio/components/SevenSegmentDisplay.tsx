"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

/* 7-segment display segment mapping
   Layout:
     ─ a ─
   |       |
   f       b
   |       |
     ─ g ─
   |       |
   e       c
   |       |
     ─ d ─
*/

const SEGMENT_MAP: Record<number, boolean[]> = {
  // [a, b, c, d, e, f, g]
  0: [true, true, true, true, true, true, false],
  1: [false, true, true, false, false, false, false],
  2: [true, true, false, true, true, false, true],
  3: [true, true, true, true, false, false, true],
  4: [false, true, true, false, false, true, true],
  5: [true, false, true, true, false, true, true],
  6: [true, false, true, true, true, true, true],
};

interface SegmentProps {
  active: boolean;
  d: string;
}

function Segment({ active, d }: SegmentProps) {
  return (
    <path
      d={d}
      fill={active ? "#F2F2F0" : "rgba(46, 46, 46, 0.3)"}
      className="transition-all duration-300"
      style={{
        filter: active ? "drop-shadow(0 0 8px rgba(242, 242, 240, 0.4))" : "none",
      }}
    />
  );
}

export default function SevenSegmentDisplay() {
  const [value, setValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollSequence, setRollSequence] = useState<number[]>([]);

  const roll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);

    // Generate rapid sequence for visual effect
    const sequence: number[] = [];
    for (let i = 0; i < 12; i++) {
      sequence.push(Math.floor(Math.random() * 6) + 1);
    }
    setRollSequence(sequence);

    // Animate through values
    let step = 0;
    const interval = setInterval(() => {
      setValue(sequence[step]);
      step++;
      if (step >= sequence.length) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
      }
    }, 80);
  }, [isRolling]);

  const segments = value !== null ? SEGMENT_MAP[value] : [false, false, false, false, false, false, false];

  // Segment paths for SVG 7-segment display
  const segmentPaths = {
    a: "M 22 8 L 78 8 L 72 16 L 28 16 Z",   // top horizontal
    b: "M 80 12 L 80 48 L 74 42 L 74 18 Z",  // top-right vertical
    c: "M 80 52 L 80 88 L 74 82 L 74 58 Z",  // bottom-right vertical
    d: "M 22 92 L 78 92 L 72 84 L 28 84 Z",  // bottom horizontal
    e: "M 20 52 L 20 88 L 26 82 L 26 58 Z",  // bottom-left vertical
    f: "M 20 12 L 20 48 L 26 42 L 26 18 Z",  // top-left vertical
    g: "M 22 50 L 78 50 L 74 54 L 26 54 Z",  // middle horizontal
  };

  const segmentKeys = ["a", "b", "c", "d", "e", "f", "g"] as const;

  // Binary representation
  const binaryStr = value !== null ? value.toString(2).padStart(3, "0") : "---";

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Display */}
      <div className="relative bg-void border border-steel/30 p-8 sm:p-12">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-32 h-40 sm:w-40 sm:h-48"
          animate={isRolling ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.08, repeat: isRolling ? Infinity : 0 }}
        >
          {segmentKeys.map((key, i) => (
            <Segment
              key={key}
              active={segments[i]}
              d={segmentPaths[key]}
            />
          ))}
        </motion.svg>

        {/* Display label */}
        <div className="absolute top-2 right-3 font-[family-name:var(--font-space-mono-family)] text-[8px] text-silver/20 tracking-widest">
          7-SEG
        </div>
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={isRolling}
        className={`font-[family-name:var(--font-ibm-plex-mono-family)] text-sm tracking-wider px-8 py-3 border transition-all duration-200 ${
          isRolling
            ? "border-silver/30 text-silver/30 cursor-not-allowed"
            : "border-silver/50 text-chalk hover:bg-steel/30 hover:border-silver/60"
        }`}
      >
        [ {isRolling ? "ROLLING..." : "ROLL"} ]
      </button>

      {/* Binary output */}
      <div className="flex items-center gap-4">
        <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-widest">
          DECIMAL:
        </span>
        <span className="font-[family-name:var(--font-space-mono-family)] text-lg text-chalk">
          {value !== null ? value : "-"}
        </span>
        <span className="font-[family-name:var(--font-space-mono-family)] text-[10px] text-silver/40 tracking-widest ml-4">
          BINARY:
        </span>
        <span className="font-[family-name:var(--font-space-mono-family)] text-lg text-chalk tracking-widest">
          {binaryStr}
        </span>
      </div>
    </div>
  );
}
