import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx + BOARD (lead decision on DAWNTRACE). Owner: proj-dawntrace.
export const project: Project = {
  slug: "dawntrace",
  title: "DAWNTRACE",
  category: "hardware",
  status: "IN PROGRESS",
  year: "2026",
  summary: "Sunrise-alarm sleep companion with sensor fusion and EEPROM logging.",
  description: [
    "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on Arduino with sensor fusion and EEPROM data logging.",
  ],
  tags: ["C++", "Arduino", "Sensor Fusion", "PCB Design", "EEPROM"],
  media: { kind: "placeholder", alt: "DAWNTRACE sleep companion (image coming soon)" },
  detail: false,
  links: [{ kind: "github", label: "GitHub", href: "https://github.com/maisinxyz/DAWNTRACE" }],
  todo: [
    "TODO(vince): the Projects page says Arduino; the brief says an ESP32-S3 with an OLED and an IR-remote menu. Which board is it?",
    "TODO(vince): date range for DAWNTRACE.",
  ],
};
