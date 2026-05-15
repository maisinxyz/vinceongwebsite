import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact — Vince Ong",
  description: "Get in touch with Vince Ong for internships, co-op placements, and engineering opportunities.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
