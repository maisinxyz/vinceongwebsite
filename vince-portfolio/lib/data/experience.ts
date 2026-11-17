import type { ProjectSlug } from "@/lib/data/projects/types";

export type ExperienceId = "ey" | "resilient-privacy" | "sfu-racerbot" | "telus-digital-ai" | "mech";

export type Experience = {
  id: ExperienceId;
  company: string;
  role: string;
  subtitle?: string;
  start: string;
  end: string;
  location?: string;
  logo: string;
  /** Logo variant for dark backgrounds, when needed (/logos/*-dark.*). */
  logoDark?: string;
  background: string;
  initials: string;
  incoming?: boolean;
  fullBleedLogo?: boolean;
  description: string;
  /** One line for landing cards. */
  impact?: string;
  tech?: string[];
  relatedProjects?: ProjectSlug[];
};

// Experience content from the original portfolio; incoming work is not presented as completed.
// `tech` lists only what each description already names. Venu is not in the repo: TODO(vince).
export const experiences: Experience[] = [
  {
    id: "ey",
    company: "Ernst & Young", role: "Technology Consulting Intern",
    subtitle: "Microsoft Technology Consulting", start: "May 2027", end: "Aug 2027",
    location: "Vancouver, BC",
    logo: "/logos/ey.svg", background: "#000000", initials: "EY", incoming: true,
    description: "Incoming Technology Consulting Intern with EY’s Microsoft Technology Consulting practice, starting May 2027.",
  },
  {
    id: "resilient-privacy",
    company: "Resilient Privacy", role: "Software Engineer Intern",
    start: "Jul 2026", end: "Present", location: "Dallas, TX · Remote",
    logo: "/logos/resilient-privacy.png", background: "#000000", initials: "RP",
    description: "Architected secure, asynchronous threat intelligence pipelines in Python and Rust to ingest and analyze security event data for the KANSHI cybersecurity platform. Built scalable backend APIs and optimized SQL schemas with strategic indexing to support high-performance queries for a React frontend. Strengthened deployment reliability through unit and integration tests and structured Git workflows.",
    tech: ["Python", "Rust", "SQL", "React", "Git"],
  },
  {
    id: "sfu-racerbot",
    company: "SFU Racerbot", role: "Software Developer", subtitle: "Autonomous Racing Team",
    start: "Jun 2026", end: "Present", location: "Burnaby, B.C.",
    logo: "/logos/sfu-racerbot.png", background: "#4792e3", initials: "SR", fullBleedLogo: true,
    description: "Contributed to a C++/Python sensor fusion pipeline using ROS2, combining 2D LIDAR and camera input for obstacle detection on an autonomous racing platform. Validated control algorithms in the F1TENTH Gym simulator to identify safety-critical bugs before hardware deployment and streamline physical testing.",
    tech: ["C++", "Python", "ROS2", "LIDAR", "F1TENTH Gym"],
    relatedProjects: ["racerbot"],
  },
  {
    id: "telus-digital-ai",
    company: "TELUS Digital AI", role: "Online Data Analyst",
    start: "Jun 2026", end: "Present", location: "Remote",
    logo: "/logos/telus-digital-ai.png", background: "#ffffff", initials: "T", fullBleedLogo: true,
    description: "Labeled and evaluated large-scale geographic datasets to support training data integrity for AI/ML mapping systems. Cross-referenced independent sources to verify location attributes, resolve discrepancies, and flag edge-case anomalies for downstream pipelines. Evaluated text-to-speech outputs for delivery, emotional inflection, and phonetic accuracy to refine conversational naturalness.",
  },
  {
    id: "mech",
    company: "MECH", role: "Finance & Development Lead", subtitle: "Medical Envoys for Community Health",
    start: "Aug 2023", end: "Jul 2025", location: "Langley, B.C.",
    logo: "/logos/mech.png", background: "#527c88", initials: "M", fullBleedLogo: true,
    description: "Led end-to-end financial operations across fundraising campaigns, managing budget allocation, operating margin analysis, and stakeholder reporting to maintain fiscal accountability. Coordinated digital and door-to-door marketing campaigns that grew organizational net assets by over 250% in two years.",
  },
];
