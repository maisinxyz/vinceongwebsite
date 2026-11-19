import type { Metadata } from "next";
import AgvPageClient from "./AgvPageClient";

export const metadata: Metadata = {
  title: "Autonomous Ground Vehicle — Vince Ong",
  description: "Mecanum-wheel autonomous ground vehicle with a robotic arm that line-follows a taped course and picks up objects. Photos and videos.",
};

export default function AgvPage() {
  return <AgvPageClient />;
}
