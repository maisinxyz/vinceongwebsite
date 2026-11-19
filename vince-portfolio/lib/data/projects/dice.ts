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
  gallery: [
    { kind: "video", src: "/projects/dice/clip-1.mp4", poster: "/projects/dice/clip-1-poster.jpg", alt: "The finished dice board running on battery power with its LEDs lit", caption: "Assembled board running", orientation: "portrait" },
    { kind: "image", src: "/projects/dice/photo-1.jpg", alt: "The assembled dice board powered by a battery lead, LEDs lit", caption: "Powered up", orientation: "landscape" },
    { kind: "image", src: "/projects/dice/photo-2.jpg", alt: "The dice PCB mid-assembly with surface-mount parts and diodes soldered", caption: "Mid-assembly: SMD parts and diodes in, sockets and LEDs next", orientation: "landscape" },
  ],
  detail: true,
  links: [],
  unverified: [
    "Display type: the board drawing shows seven pip LEDs, while earlier copy described a 7-segment display.",
    "Part numbers on the drawing (CD4017, CD4511) and the board layout are reconstructions.",
  ],
  todo: [
    "TODO(vince): which display does the board use? The mid-assembly photo shows seven LED pads in a dice-pip layout; the résumé says 7-segment.",
    "TODO(vince): a schematic or BOM of the real board, if you have one.",
  ],
};
