import type { Metadata } from "next";
import PortfolioPageClient from "./PortfolioPageClient";

export const metadata: Metadata = {
  title: "Engineering Portfolio — Vince Ong",
  description:
    "Interactive engineering portfolio showcasing projects, experience, and skills in mechatronic systems, embedded firmware, PCB design, and full-stack development.",
};

export default function PortfolioViewPage() {
  return <PortfolioPageClient />;
}
