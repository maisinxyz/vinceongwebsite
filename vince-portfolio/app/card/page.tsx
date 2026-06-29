import type { Metadata } from "next";
import CardPageClient from "./CardPageClient";

export const metadata: Metadata = {
  title: "Card — Vince Ong",
  description: "Vince Ong's digital business card — LinkedIn, GitHub, and Email.",
};

export default function CardPage() {
  return <CardPageClient />;
}
