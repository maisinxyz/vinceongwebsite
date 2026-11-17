import type { Project } from "./types";

// Seed from SPEC C (MSE 112 topics) and SPEC E. Owner: proj-mse112.
// status is a placeholder until Vince confirms it (see todo).
export const project: Project = {
  slug: "shape-sorting",
  title: "SHAPE SORTING",
  subtitle: "MSE 112 · MasterPi",
  category: "hardware",
  status: "COMPLETED",
  year: "TODO(vince)",
  course: "MSE 112",
  summary: "Shape sorting on a MasterPi with computer vision, built for MSE 112.",
  description: ["Shape sorting with computer vision on a MasterPi, built for MSE 112."],
  tags: ["Python", "Computer Vision", "Raspberry Pi"],
  media: { kind: "placeholder", alt: "Shape sorting demo (image coming soon)" },
  detail: false,
  links: [],
  todo: [
    "TODO(vince): year, status and date range of the shape sorting project.",
    "TODO(vince): confirm the shapes sorted (circle / triangle / square from the brief) and the vision method (OpenCV contours?).",
  ],
};
