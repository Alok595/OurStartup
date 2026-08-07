import Services from "@/components/ui/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description: "Comprehensive software development services including web apps, mobile applications, and AI integrations.",
};
export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen pt-24 bg-[var(--bg)]">
      <Services />
    </main>
  );
}
