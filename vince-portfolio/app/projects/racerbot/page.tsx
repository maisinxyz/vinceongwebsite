import type { Metadata } from "next";
import RacerbotPageClient from "./RacerbotPageClient";

export const metadata: Metadata = {
  title: "Racerbot — Vince Ong",
  description: "SFU Racerbot: ROS2 sensor fusion and LIDAR mapping for an F1TENTH autonomous race car. Champion Award, IEEE ComSoc 2026 Fall F1TENTH Challenge.",
};

export default function RacerbotPage() {
  return <RacerbotPageClient />;
}
