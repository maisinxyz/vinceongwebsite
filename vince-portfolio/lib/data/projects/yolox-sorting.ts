import type { Project } from "./types";

// Seed from SPEC C (MSE 112 topics) and SPEC E. Owner: proj-mse112.
// status and category are placeholders until Vince confirms them (see todo).
export const project: Project = {
  slug: "yolox-sorting",
  title: "YOLOX CAT/DOG SORTING",
  subtitle: "MSE 112",
  category: "hardware",
  status: "COMPLETED",
  year: "TODO(vince)",
  course: "MSE 112",
  summary: "Cat and dog sorting with YOLOX object detection, built for MSE 112.",
  description: ["Cat and dog sorting using YOLOX object detection, built for MSE 112."],
  tags: ["YOLOX", "Computer Vision", "Python"],
  media: { kind: "placeholder", alt: "YOLOX detection demo (image coming soon)" },
  detail: false,
  // Hidden from /projects until Vince confirms the details below.
  unlisted: true,
  links: [],
  todo: [
    "TODO(vince): year, status and date range of the YOLOX sorting project.",
    "TODO(vince): is this hardware (Raspberry Pi sorting rig) or software? Seeded as hardware.",
    "TODO(vince): which YOLOX models were compared (the brief mentions Nano / Tiny / Small) and any results.",
  ],
};
