import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Variants } from "framer-motion";

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conditional classes and deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a readable format
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-US", defaultOptions);
}

/**
 * Generate staggered Framer Motion variants
 * Mechanical, precision feel — no bounce, sharp easing
 */
export function stagger(
  staggerDelay: number = 0.08,
  direction: "up" | "down" | "left" | "right" = "up"
): Variants {
  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  const offset = directionMap[direction];

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: (i: number = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * staggerDelay,
        duration: 0.6,
        ease: [0.25, 0, 0, 1],
      },
    }),
  };
}

/**
 * Mechanical ease curves used throughout the site
 * Named after machine operations for thematic consistency
 */
export const EASING = {
  /** Sharp, precise — like a CNC cut */
  precision: [0.25, 0, 0, 1] as const,
  /** Aggressive deceleration — like a hydraulic press */
  hydraulic: [0.76, 0, 0.24, 1] as const,
  /** Smooth but intentional — like a linear actuator */
  actuator: [0.33, 0, 0.67, 1] as const,
  /** Quick start, controlled stop — like a servo */
  servo: [0.4, 0, 0.2, 1] as const,
};

/**
 * Standard page transition config
 */
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.4,
    ease: EASING.hydraulic,
  },
};

/**
 * Reveal animation config for scroll-triggered elements
 */
export const REVEAL_ANIMATION = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING.precision,
    },
  },
};

/**
 * Project data type
 */
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  categories: string[];
  year: string;
  dateRange: string;
  status: "COMPLETED" | "ACTIVE";
  featured?: boolean;
  accentColor?: string;
  link?: string;
}

/**
 * Experience data type
 */
export interface Experience {
  company: string;
  role: string;
  location: string;
  dateRange: string;
  achievements: string[];
  type: "work" | "education";
}

/**
 * All project data
 */
export const PROJECTS: Project[] = [
  {
    slug: "engram",
    title: "ENGRAM",
    tagline: "B2B AI SaaS · LLM-Powered Enterprise Memory",
    description:
      "Co-founded and engineered a B2B AI SaaS platform that transforms fragmented enterprise knowledge into a unified, queryable intelligence layer. Built semantic data pipelines, architected RAG search interfaces, and designed multi-source knowledge base integration.",
    tags: ["TypeScript", "Python", "Supabase", "RAG", "LLM"],
    categories: ["SOFTWARE"],
    year: "2026",
    dateRange: "APRIL 2026 – PRESENT",
    status: "ACTIVE",
    featured: true,
    accentColor: "#4A7B9A",
    link: "https://engram-pi-ruddy.vercel.app",
  },
  {
    slug: "spice",
    title: "AUTOMATIC SPICE DISPENSER",
    tagline: "Embedded Systems · C++ · Arduino · 3D Printing",
    description:
      "Designed and built a precision automatic spice dispensing system using stepper motor firmware, custom 3D-printed mechanical assemblies, and Arduino-based control logic. Full hardware-software integration from concept to functional prototype.",
    tags: ["C++", "Arduino", "3D Printing", "Stepper Motors"],
    categories: ["EMBEDDED", "HARDWARE"],
    year: "2025",
    dateRange: "SEPT 2025 – DEC 2025",
    status: "COMPLETED",
    accentColor: "#5A8A6A",
  },
  {
    slug: "dice",
    title: "DIGITAL DICE",
    tagline: "Boolean Logic · PCB Assembly · SMD Soldering",
    description:
      "Engineered a digital dice using combinational logic and PCB assembly. Designed boolean logic circuits, assembled surface-mount components, and validated circuit behavior through systematic testing.",
    tags: ["Boolean Logic", "PCB", "SMD Soldering", "EAGLE"],
    categories: ["HARDWARE", "EMBEDDED"],
    year: "2025",
    dateRange: "SEPT 2025 – DEC 2025",
    status: "COMPLETED",
    accentColor: "#8A6A5A",
  },
];

/**
 * All experience data
 */
export const EXPERIENCES: Experience[] = [
  {
    company: "MECH",
    role: "Finance & Development Lead",
    location: "British Columbia, Canada",
    dateRange: "AUG 2023 – JUL 2025",
    achievements: [
      "Directed financial operations for a student-founded non-profit organization recognized by the Government of B.C., dedicated to raising awareness about health-related issues through digital media and fundraising initiatives.",
      "Scaled organizational assets by 250% through strategic budget management, resource allocation, and operational process optimization.",
      "Led cross-functional team coordination, implementing structured project management methodologies including GANTT scheduling and milestone tracking to ensure on-time delivery of campaigns.",
    ],
    type: "work",
  },
  {
    company: "PNE (Pacific National Exhibition)",
    role: "Games Attendant",
    location: "Vancouver, B.C., Canada",
    dateRange: "AUG 2025 – SEP 2025",
    achievements: [
      "Managed high-throughput operations in a fast-paced environment, demonstrating ability to maintain quality and efficiency under pressure — skills directly transferable to production line and lab settings.",
      "Applied systematic troubleshooting to equipment maintenance, ensuring zero downtime during peak operational periods.",
    ],
    type: "work",
  },
  {
    company: "Simon Fraser University",
    role: "BASc Mechatronic Systems Engineering",
    location: "Burnaby, B.C., Canada",
    dateRange: "SEP 2025 – PRESENT",
    achievements: [
      "Maintaining a 3.7/4.3 GPA in a rigorous engineering program combining mechanical, electrical, and software disciplines.",
      "Recipient of the BC Achievement Scholarship (Oct 2025) recognizing academic excellence and community leadership.",
      "IB Diploma graduate (July 2025) — strong foundation in analytical thinking and cross-disciplinary problem-solving.",
    ],
    type: "education",
  },
];

/**
 * Skills matrix data for the About page
 */
export const SKILLS_MATRIX = {
  Languages: {
    Advanced: [
      { name: "C++", tooltip: "Used in Spice Dispenser firmware & embedded systems" },
      { name: "TypeScript", tooltip: "Primary language for Engram SaaS platform" },
    ],
    Proficient: [
      { name: "Python", tooltip: "Semantic data pipeline development for Engram" },
    ],
    Familiar: [],
  },
  Hardware: {
    Advanced: [
      { name: "Soldering", tooltip: "SMD & through-hole for Digital Dice PCB" },
      { name: "3D Printing", tooltip: "Custom enclosures for Spice Dispenser" },
    ],
    Proficient: [
      { name: "Oscilloscopes", tooltip: "Signal analysis and debugging" },
      { name: "DMM", tooltip: "Circuit validation and testing" },
      { name: "Microcontrollers", tooltip: "Arduino-based control systems" },
      { name: "PCB Assembly", tooltip: "Full assembly pipeline for Digital Dice" },
    ],
    Familiar: [],
  },
  "Software / Tools": {
    Advanced: [
      { name: "Git / GitHub", tooltip: "Version control across all projects" },
      { name: "Arduino IDE", tooltip: "Firmware development environment" },
    ],
    Proficient: [
      { name: "Supabase", tooltip: "Backend infrastructure for Engram" },
      { name: "Vercel", tooltip: "Deployment pipeline for Engram" },
    ],
    Familiar: [
      { name: "LTspice", tooltip: "Circuit simulation and analysis" },
      { name: "EAGLE", tooltip: "PCB design for Digital Dice" },
    ],
  },
  Methodologies: {
    Advanced: [],
    Proficient: [
      { name: "Agile / Scrum", tooltip: "Applied at Engram and MECH" },
      { name: "GANTT Planning", tooltip: "Project scheduling at MECH" },
    ],
    Familiar: [
      { name: "RAG Architecture", tooltip: "Retrieval-Augmented Generation for Engram" },
      { name: "CI/CD", tooltip: "Continuous deployment via Vercel" },
    ],
  },
};
