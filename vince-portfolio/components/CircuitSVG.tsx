"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CircuitSVG({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // PCB trace paths — abstract circuit board layout
  const traces = [
    { d: "M 40 200 L 120 200 L 120 80 L 240 80", delay: 0 },
    { d: "M 40 280 L 180 280 L 180 160 L 320 160", delay: 0.2 },
    { d: "M 120 80 L 120 40 L 280 40", delay: 0.4 },
    { d: "M 180 280 L 180 360 L 320 360", delay: 0.6 },
    { d: "M 240 80 L 360 80 L 360 200", delay: 0.8 },
    { d: "M 320 160 L 320 240 L 400 240", delay: 1.0 },
    { d: "M 280 40 L 400 40 L 400 120", delay: 1.2 },
    { d: "M 320 360 L 400 360 L 400 300", delay: 1.4 },
  ];

  // Nodes at path endpoints
  const nodes = [
    { cx: 40, cy: 200, delay: 0.3 },
    { cx: 240, cy: 80, delay: 0.7 },
    { cx: 40, cy: 280, delay: 0.5 },
    { cx: 320, cy: 160, delay: 0.9 },
    { cx: 280, cy: 40, delay: 1.1 },
    { cx: 320, cy: 360, delay: 1.3 },
    { cx: 360, cy: 200, delay: 1.5 },
    { cx: 400, cy: 240, delay: 1.7 },
    { cx: 400, cy: 120, delay: 1.9 },
    { cx: 400, cy: 300, delay: 2.1 },
    { cx: 120, cy: 200, delay: 0.4 },
    { cx: 180, cy: 280, delay: 0.6 },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      {/* Traces */}
      {traces.map((trace, i) => (
        <motion.path
          key={i}
          d={trace.d}
          stroke="rgba(168, 168, 168, 0.3)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="square"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              delay: trace.delay,
              duration: 0.8,
              ease: [0.25, 0, 0, 1],
            },
            opacity: { delay: trace.delay, duration: 0.1 },
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="4"
          fill="rgba(168, 168, 168, 0.15)"
          stroke="rgba(168, 168, 168, 0.4)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isInView
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            delay: node.delay,
            duration: 0.4,
            ease: [0.25, 0, 0, 1],
          }}
        />
      ))}

      {/* Pulsing nodes — key junction points */}
      {[
        { cx: 240, cy: 80 },
        { cx: 320, cy: 160 },
        { cx: 360, cy: 200 },
        { cx: 400, cy: 240 },
      ].map((node, i) => (
        <motion.circle
          key={`pulse-${i}`}
          cx={node.cx}
          cy={node.cy}
          r="6"
          fill="none"
          stroke="rgba(58, 107, 138, 0.3)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0, 0.4],
                }
              : {}
          }
          transition={{
            delay: 2.5 + i * 0.3,
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}
