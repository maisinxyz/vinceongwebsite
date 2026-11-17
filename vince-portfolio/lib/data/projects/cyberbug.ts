import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx. List-only (no detail page, CONTRACT 5). Owner: proj-stardew.
export const project: Project = {
  slug: "cyberbug",
  title: "CYBERBUG 2077",
  category: "software",
  status: "COMPLETED",
  year: "2024",
  summary: "Fast-paced indie 2D platformer set in an infinite glitchy codeworld.",
  description: [
    "A fast-paced indie 2D platformer. You play as an anomaly running around in an infinite codeworld. Dodge debuggers, grab invisibility orbs, and cause as much dismay (Corruption) as possible.",
  ],
  tags: ["Game Dev", "C#", "Unity", "Pixel Art"],
  media: { kind: "image", src: "/cyberbug2077.png", alt: "Cyberbug 2077 gameplay screenshot" },
  detail: false,
  links: [{ kind: "github", label: "GitHub", href: "https://github.com/maisinxyz/CyberBug2077" }],
};
