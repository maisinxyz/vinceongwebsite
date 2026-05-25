import type { Metadata } from "next";
import GurtPageClient from "./GurtPageClient";

export const metadata: Metadata = {
  title: "GURT — Vince Ong",
  description: "Archived components and sections from previous website iterations.",
};

export default function GurtPage() {
  return <GurtPageClient />;
}
