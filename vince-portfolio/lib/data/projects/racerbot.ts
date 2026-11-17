import type { Project } from "./types";

// Seed from lib/data/experience.ts (SFU Racerbot) and BOARD. Owner: proj-racerbot.
export const project: Project = {
  slug: "racerbot",
  title: "RACERBOT",
  subtitle: "SFU Racerbot · Autonomous Racing Team",
  category: "software",
  status: "ACTIVE",
  year: "2026",
  dateRange: "JUN 2026 – PRESENT",
  summary: "ROS2 sensor fusion of 2D LIDAR and camera for an autonomous racing car.",
  description: [
    "Contributed to a C++/Python sensor fusion pipeline using ROS2, combining 2D LIDAR and camera input for obstacle detection on an autonomous racing platform. Validated control algorithms in the F1TENTH Gym simulator to identify safety-critical bugs before hardware deployment and streamline physical testing.",
  ],
  tags: ["C++", "Python", "ROS2", "LIDAR", "F1TENTH Gym"],
  media: { kind: "placeholder", alt: "Racerbot track viewer (image coming soon)" },
  detail: false,
  links: [],
  relatedExperience: ["sfu-racerbot"],
  todo: [
    "TODO(vince): project-specific details beyond the experience entry (your part, results, repo link if public).",
  ],
};
