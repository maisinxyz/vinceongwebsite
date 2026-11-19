import type { Project } from "./types";

// Seed from NEW HARDWARE DOCS (AGV img1, AGV vid 1-4) and Vince's answers (MSE 112 MasterPi, Summer 2026).
const DIR = "/projects/agv";

export const project: Project = {
  slug: "agv",
  title: "AUTONOMOUS GROUND VEHICLE",
  subtitle: "MSE 112 · MasterPi · Mecanum drive and robotic arm",
  category: "hardware",
  status: "COMPLETED",
  year: "2026",
  dateRange: "SUMMER 2026",
  course: "MSE 112",
  summary: "Mecanum-wheel ground vehicle that line-follows a taped track and picks up objects.",
  description: [
    "An autonomous ground vehicle built on a Raspberry Pi MasterPi: a mecanum-wheel chassis with an on-board robotic arm. The robot follows a taped line course on its own and uses the arm to pick up objects along the route.",
    "Vince developed the code and hardware for the entire project: Python and C++ on the robot, MATLAB for testing, flashing and configuring the Raspberry Pi, and setting up the camera and ultrasonic sensors the vehicle uses to see the course and its surroundings.",
    "Mecanum wheels let the chassis strafe and rotate in place, so the vehicle can line up with a target without a three-point turn.",
  ],
  tags: ["Python", "C++", "Raspberry Pi", "MATLAB", "Mecanum Drive", "Robotic Arm", "Ultrasonic Sensors"],
  media: {
    kind: "video",
    src: `${DIR}/clip-2.mp4`,
    poster: `${DIR}/clip-2-poster.jpg`,
    alt: "The AGV following a taped line course on a lab table",
    orientation: "portrait",
  },
  gallery: [
    { kind: "image", src: `${DIR}/photo-1.jpg`, alt: "The AGV on the lab floor with its arm extended", caption: "Mecanum chassis and arm", orientation: "landscape" },
    { kind: "video", src: `${DIR}/clip-1.mp4`, poster: `${DIR}/clip-1-poster.jpg`, alt: "Close-up of the AGV arm moving", caption: "Arm test", orientation: "portrait" },
    { kind: "video", src: `${DIR}/clip-3.mp4`, poster: `${DIR}/clip-3-poster.jpg`, alt: "The AGV picking up an object on the line course", caption: "Pick on the course", orientation: "portrait" },
    { kind: "video", src: `${DIR}/clip-4.mp4`, poster: `${DIR}/clip-4-poster.jpg`, alt: "The AGV following a green line on the floor", caption: "Floor line run", orientation: "portrait" },
  ],
  detail: true,
  links: [{ kind: "github", label: "GitHub", href: "https://github.com/hmarthens1/mse112-ws-student" }],
};
