import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx, app/projects/spice/SpicePageClient.tsx and SPEC C. Owner: spice3d.
export const project: Project = {
  slug: "spice",
  title: "AUTOMATIC SPICE DISPENSER",
  category: "hardware",
  status: "COMPLETED",
  year: "2025",
  dateRange: "SEPT 2025 – DEC 2025",
  course: "ENSC 100",
  summary: "Automated spice dispenser with stepper motors and sub-degree precision.",
  description: [
    "A fully automated spice dispensing system using stepper motor firmware with sub-degree precision. Features 3D-printed mechanical assemblies and custom C++ Arduino firmware.",
  ],
  tags: ["C++", "Arduino", "3D Printing", "Stepper Motors", "CAD"],
  media: { kind: "video", src: "/spicedispenserdemovideo.MOV", alt: "Automatic spice dispenser demo video" },
  detail: true,
  links: [],
};
