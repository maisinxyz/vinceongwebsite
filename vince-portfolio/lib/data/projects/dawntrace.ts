import type { Project } from "./types";

// Seed from app/projects/ProjectsPageClient.tsx + BOARD (lead decision on DAWNTRACE) and NEW HARDWARE DOCS
// (dawntrace img1-2, vid 1). Owner: proj-dawntrace.
const DIR = "/projects/dawntrace";

export const project: Project = {
  slug: "dawntrace",
  title: "DAWNTRACE",
  category: "hardware",
  status: "IN PROGRESS",
  year: "2026",
  summary: "Sunrise-alarm sleep companion with sensor fusion and EEPROM logging.",
  description: [
    "A bedside sleep companion that silently logs sleep data through the night, then wakes with a gradual sunrise light and rising alarm melody. Built on Arduino with sensor fusion and EEPROM data logging.",
    "The breadboard prototype runs on an Arduino Uno with a 16×2 LCD showing the time, date and alarm. An IR receiver takes remote input, a temperature and humidity sensor and a photoresistor read the room, and a buzzer and relay drive the alarm and light.",
  ],
  tags: ["C++", "Arduino", "Sensor Fusion", "PCB Design", "EEPROM"],
  media: {
    kind: "image",
    src: `${DIR}/photo-2.jpg`,
    alt: "DAWNTRACE breadboard prototype with an LCD showing the time and alarm",
    orientation: "landscape",
  },
  gallery: [
    { kind: "video", src: `${DIR}/clip-1.mp4`, poster: `${DIR}/clip-1-poster.jpg`, alt: "DAWNTRACE prototype running, with the LCD lit", caption: "Prototype running", orientation: "portrait" },
    { kind: "image", src: `${DIR}/photo-1.jpg`, alt: "DAWNTRACE breadboard wiring and LCD from the side", caption: "Breadboard wiring", orientation: "landscape" },
  ],
  detail: true,
  links: [{ kind: "github", label: "GitHub", href: "https://github.com/maisinxyz/DAWNTRACE" }],
  todo: [
    "TODO(vince): the prototype photos show an Arduino Uno; the brief says an ESP32-S3 with an OLED and an IR-remote menu. Is the ESP32-S3 the next revision?",
    "TODO(vince): date range for DAWNTRACE.",
  ],
};
