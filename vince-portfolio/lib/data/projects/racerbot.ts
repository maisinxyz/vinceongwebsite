import type { Project } from "./types";

// Seed from lib/data/experience.ts (SFU Racerbot), BOARD and NEW HARDWARE DOCS (Racerbot img1-2,
// certificate, vid 1-3). Owner: proj-racerbot.
const DIR = "/projects/racerbot";

export const project: Project = {
  slug: "racerbot",
  title: "RACERBOT",
  subtitle: "SFU Racerbot · Autonomous Racing Team",
  category: "software",
  status: "ACTIVE",
  year: "2026",
  dateRange: "JUN 2026 – PRESENT",
  summary: "ROS2 sensor fusion and mapping for a 1/10-scale F1TENTH autonomous race car.",
  description: [
    "Contributed to a C++/Python sensor fusion pipeline using ROS2, combining 2D LIDAR and camera input for obstacle detection on an autonomous racing platform. Validated control algorithms in the F1TENTH Gym simulator to identify safety-critical bugs before hardware deployment and streamline physical testing.",
    "The car maps its course with LIDAR (the hallway and race track maps below). SFU Racerbot's team took the Champion Award at the IEEE ComSoc 2026 Fall F1TENTH Autonomous Racing Challenge.",
  ],
  tags: ["C++", "Python", "ROS2", "LIDAR", "F1TENTH Gym", "SLAM"],
  media: {
    kind: "video",
    src: `${DIR}/clip-1.mp4`,
    poster: `${DIR}/clip-1-poster.jpg`,
    alt: "The Racerbot car driving itself down a hallway",
    orientation: "portrait",
  },
  gallery: [
    { kind: "image", src: `${DIR}/certificate.jpg`, alt: "The SFU Racerbot team holding the IEEE ComSoc F1TENTH Champion Award certificate", caption: "Champion Award · IEEE ComSoc 2026 Fall F1TENTH Challenge", orientation: "landscape" },
    { kind: "image", src: `${DIR}/photo-1.jpg`, alt: "The F1TENTH car with LIDAR and camera mounted, on a hallway floor", caption: "The car: LIDAR, depth camera, on-board compute", orientation: "landscape" },
    { kind: "image", src: `${DIR}/photo-2.jpg`, alt: "Two 1/10-scale race car chassis and a controller on a table", caption: "Chassis in progress", orientation: "portrait" },
    { kind: "video", src: `${DIR}/clip-2.mp4`, poster: `${DIR}/clip-2-poster.jpg`, alt: "Screen recording of a LIDAR map of a hallway being built", caption: "Mapping a hallway", orientation: "landscape" },
    { kind: "video", src: `${DIR}/clip-3.mp4`, poster: `${DIR}/clip-3-poster.jpg`, alt: "Screen recording of a race track map with the car's planned path", caption: "Race track map", orientation: "landscape" },
  ],
  detail: true,
  links: [],
  relatedExperience: ["sfu-racerbot"],
  todo: [
    "TODO(vince): were you on the racing team named on the Champion Award certificate, or is this a club win? The copy credits the team.",
    "TODO(vince): which SLAM / localization stack (slam_toolbox + particle filter?) and planner the car uses, and a repo link if public.",
  ],
};
