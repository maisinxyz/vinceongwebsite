import type { Metadata } from "next";
import DicePageClient from "./DicePageClient";

export const metadata: Metadata = {
  title: "Digital Dice — Vince Ong",
  description: "Digital dice using combinational logic and PCB assembly. Boolean logic, SMD soldering, EAGLE.",
};

export default function DicePage() {
  return <DicePageClient />;
}
