import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx, components/DigitalDicePCB.tsx and SPEC C. Owner: dice.
// The display type is disputed in the repo, so the summary avoids claiming either.
export const project: Project = {
  slug: "dice",
  title: "DIGITAL DICE",
  category: "hardware",
  status: "COMPLETED",
  year: "2025",
  dateRange: "SEPT 2025 – DEC 2025",
  course: "ENSC 120",
  summary: "Mixed-technology PCB decoding binary counter states into LED dice patterns.",
  description: [
    "A mixed-technology PCB using combinational boolean logic to decode binary counter states into LED dice patterns. Hand-soldered SMD and through-hole components.",
  ],
  tags: ["Boolean Logic", "PCB", "SMD Soldering", "EAGLE"],
  media: { kind: "component", alt: "Interactive digital dice circuit board" },
  detail: true,
  links: [],
  unverified: [
    "Display type: the board drawing shows seven pip LEDs, while earlier copy described a 7-segment display.",
    "Part numbers on the drawing (CD4017, CD4511) and the board layout are reconstructions.",
  ],
  todo: ["TODO(vince): photo, schematic or BOM of the real board, and which display it uses."],
};
