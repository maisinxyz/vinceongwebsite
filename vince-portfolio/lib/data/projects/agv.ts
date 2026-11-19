import type { Project } from "./types";

// Seed from NEW HARDWARE DOCS (AGV img1, AGV vid 1-4). Copy describes only what the media shows.
const DIR = "/projects/agv";

export const project: Project = {
  slug: "agv",
  title: "AUTONOMOUS GROUND VEHICLE",
  subtitle: "Mecanum drive · Robotic arm · Line following",
  category: "hardware",
  status: "COMPLETED",
  year: "TODO(vince)",
  summary: "Mecanum-wheel ground vehicle that line-follows a taped track and picks up objects.",
  description: [
    "An autonomous ground vehicle built on a mecanum-wheel chassis with an on-board robotic arm and camera. The robot follows a taped line course on its own and uses the arm to pick up objects along the route.",
    "Mecanum wheels let the chassis strafe and rotate in place, so the vehicle can line up with a target without a three-point turn.",
  ],
  tags: ["Robotics", "Mecanum Drive", "Robotic Arm", "Line Following", "Computer Vision"],
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
  links: [],
  todo: [
    "TODO(vince): year, date range and course (is this the MSE 112 MasterPi used for shape sorting / YOLOX?).",
    "TODO(vince): your role, the controller and language (Raspberry Pi + Python?), and how line following and picking work (camera vs. IR sensors).",
    "TODO(vince): any results (lap time, pick success rate) and a repo link.",
  ],
};
