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
  gallery: [
    { kind: "video", src: "/projects/spice/clip-1.mp4", poster: "/projects/spice/clip-1-poster.jpg", alt: "The Flavourinator spice dispenser running, front view", caption: "Running demo", orientation: "portrait" },
    { kind: "video", src: "/projects/spice/clip-2.mp4", poster: "/projects/spice/clip-2-poster.jpg", alt: "The Flavourinator with its three spice tubes and LCD, front view", caption: "Three spice tubes, LCD and selector", orientation: "portrait" },
    { kind: "image", src: "/projects/spice/photo-1.jpg", alt: "Inside the dispenser: Arduino, stepper drivers and wiring under the hoppers", caption: "Inside: Arduino, stepper drivers and wiring", orientation: "landscape" },
    { kind: "video", src: "/projects/spice/clip-3.mp4", poster: "/projects/spice/clip-3-poster.jpg", alt: "Close-up of the Flavourinator's hoppers and dispensing bay", caption: "Close-up", orientation: "portrait" },
  ],
  detail: true,
  links: [],
};
