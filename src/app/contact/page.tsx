import { Metadata } from "next";
import ContactClientForm from "@/components/forms/ContactClientForm";

export const metadata: Metadata = {
  title: "Contact Us | Start a Project",
  description: "Tell us what you're building. A four-step brief straight to our engineering team. We review and reply within 24 hours.",
  openGraph: {
    title: "Contact GenZDevWorks | Start a Project",
    description: "Tell us what you're building. A four-step brief straight to our engineering team.",
  },
};

export default function ContactPage() {
  return <ContactClientForm />;
}