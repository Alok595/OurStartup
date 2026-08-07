import { Metadata } from "next";
import AboutSection from "@/components/ui/AboutSection";

export const metadata: Metadata = {
  title: "About Us | IIT Engineers building scalable products",
  description: "Learn about our vision and our team of IIT engineers dedicated to crafting scalable, premium software for startups and enterprises.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AboutSection />
    </main>
  );
}
