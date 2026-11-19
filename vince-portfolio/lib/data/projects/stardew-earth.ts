import type { Project } from "./types";

// Seed from BOARD (Vince: Stardew Earth = FieldTwin) and CONTRACT Q7. Owner: proj-stardew.
// Only four facts are known: NASA Space Apps, a 3D farm twin, an Earth hero with
// waypoints that zooms into a farm, and a pixel-sprout logo.
export const project: Project = {
  slug: "stardew-earth",
  title: "STARDEW EARTH",
  subtitle: "FieldTwin · NASA Space Apps",
  category: "software",
  status: "COMPLETED",
  year: "TODO(vince)",
  summary: "FieldTwin: a 3D farm twin from NASA Space Apps, from Earth view down to a farm.",
  description: [
    "FieldTwin is a 3D twin of a farm, built for the NASA Space Apps Challenge. It opens on Earth with waypoints and zooms into a farm.",
  ],
  tags: ["NASA Space Apps", "3D"],
  media: { kind: "placeholder", alt: "Stardew Earth globe (image coming soon)" },
  detail: false,
  // Hidden from /projects until Vince confirms the details below.
  unlisted: true,
  links: [],
  todo: [
    "TODO(vince): confirm the name \"STARDEW EARTH\" with subtitle \"FieldTwin\" (CONTRACT Q7).",
    "TODO(vince): year, status, team, your role, tech stack and any repo or demo link.",
  ],
};
