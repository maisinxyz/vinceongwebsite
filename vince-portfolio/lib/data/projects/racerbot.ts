import type { Project } from "./types";

// Seed from lib/data/experience.ts (SFU Racerbot), BOARD and NEW HARDWARE DOCS (Racerbot img1-2,
// certificate, vid 1-3). Stack from github.com/sfu-racerbot/racerbot_a (src/ packages). Owner: proj-racerbot.
const DIR = "/projects/racerbot";

export const project: Project = {
  slug: "racerbot",
  title: "RACERBOT",
  subtitle: "SFU Racerbot · Team A · Autonomous Racing",
  category: "software",
  status: "ACTIVE",
  year: "2026",
  dateRange: "JUN 2026 – PRESENT",
  summary: "ROS2 sensor fusion and racing stack for a 1/10-scale F1TENTH autonomous race car.",
  description: [
    "Contributed to a C++/Python sensor fusion pipeline using ROS2, combining 2D LIDAR and camera input for obstacle detection on an autonomous racing platform. Validated control algorithms in the F1TENTH Gym simulator to identify safety-critical bugs before hardware deployment and streamline physical testing.",
    "Team A is the club's primary software team. Its stack pairs reactive control (follow-the-gap and a disparity extender) with an emergency-braking safety node, and tracks an optimized raceline with pure pursuit on maps the car builds with LIDAR (the hallway and race track maps below).",
    "SFU Racerbot took the Champion Award at the IEEE ComSoc 2026 Fall F1TENTH Autonomous Racing Challenge, racing on code Vince contributed to directly.",
  ],
  tags: ["C++", "Python", "ROS2", "LIDAR", "F1TENTH Gym", "Pure Pursuit"],
  media: {
    kind: "video",
    src: `${DIR}/clip-1.mp4`,
    poster: `${DIR}/clip-1-poster.jpg`,
    alt: "The Racerbot car driving itself down a hallway",
    orientation: "portrait",
  },
  gallery: [
    { kind: "image", src: `${DIR}/certificate.jpg`, alt: "SFU Racerbot members holding the IEEE ComSoc F1TENTH Champion Award certificate", caption: "Club win · Champion Award, IEEE ComSoc 2026 Fall F1TENTH Challenge", orientation: "landscape" },
    { kind: "image", src: `${DIR}/photo-1.jpg`, alt: "The F1TENTH car with LIDAR and camera mounted, on a hallway floor", caption: "The car: LIDAR, depth camera, on-board compute", orientation: "landscape" },
    { kind: "image", src: `${DIR}/photo-2.jpg`, alt: "Two 1/10-scale race car chassis and a controller on a table", caption: "Chassis in progress", orientation: "portrait" },
    { kind: "video", src: `${DIR}/clip-2.mp4`, poster: `${DIR}/clip-2-poster.jpg`, alt: "Screen recording of a LIDAR map of a hallway being built", caption: "Mapping a hallway", orientation: "landscape" },
    { kind: "video", src: `${DIR}/clip-3.mp4`, poster: `${DIR}/clip-3-poster.jpg`, alt: "Screen recording of a race track map with the car's planned path", caption: "Race track map", orientation: "landscape" },
  ],
  detail: true,
  links: [{ kind: "github", label: "Team A repo", href: "https://github.com/sfu-racerbot/racerbot_a" }],
  relatedExperience: ["sfu-racerbot"],
};
