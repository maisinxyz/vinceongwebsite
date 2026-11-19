import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx + BOARD (lead decision on DAWNTRACE) and NEW HARDWARE DOCS
// (dawntrace img1-2, vid 1). Personal project, no course; the photos show the earlier Arduino Uno prototype.
// Owner: proj-dawntrace.
const DIR = "/projects/dawntrace";

export const project: Project = {
  slug: "dawntrace",
  title: "DAWNTRACE",
  subtitle: "Personal project",
  category: "hardware",
  status: "IN PROGRESS",
  year: "2026",
  summary: "Sunrise-alarm sleep companion with sensor fusion and EEPROM logging.",
  description: [
    "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Now built on an ESP32, with sensor fusion and EEPROM data logging.",
    "The photos show the first breadboard prototype, on an Arduino Uno with a 16×2 LCD showing the time, date and alarm. An IR receiver takes remote input, a temperature and humidity sensor and a photoresistor read the room, and a buzzer and relay drive the alarm and light.",
  ],
  tags: ["C++", "ESP32", "Sensor Fusion", "PCB Design", "EEPROM"],
  media: {
    kind: "image",
    src: `${DIR}/photo-2.jpg`,
    alt: "DAWNTRACE first breadboard prototype with an LCD showing the time and alarm",
    orientation: "landscape",
  },
  gallery: [
    { kind: "video", src: `${DIR}/clip-1.mp4`, poster: `${DIR}/clip-1-poster.jpg`, alt: "DAWNTRACE prototype running, with the LCD lit", caption: "First prototype running (Arduino Uno)", orientation: "portrait" },
    { kind: "image", src: `${DIR}/photo-1.jpg`, alt: "DAWNTRACE breadboard wiring and LCD from the side", caption: "Breadboard wiring, first revision", orientation: "landscape" },
  ],
  detail: true,
  links: [{ kind: "github", label: "GitHub", href: "https://github.com/maisinxyz/DAWNTRACE" }],
};
