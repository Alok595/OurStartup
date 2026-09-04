import Services from "@/components/ui/Services";
import FAQSection from "@/components/ui/FAQSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description: "Comprehensive software development services including web apps, mobile applications, and AI integrations.",
};

const SERVICES_FAQS = [
  {
    q: "What technologies do you specialize in?",
    a: "We specialize in modern web and mobile tech stacks including Next.js, React, Node.js, React Native, and AI integrations using Python and OpenAI.",
  },
  {
    q: "Do you provide ongoing support after launch?",
    a: "Yes, we offer comprehensive maintenance and support packages to ensure your digital product stays secure and up-to-date.",
  },
  {
    q: "How long does it take to build a custom application?",
    a: "Timelines vary by complexity. A standard web application typically takes 2-4 months, while larger enterprise or AI-driven platforms may take 4-6+ months.",
  },
];

export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen pt-24 bg-[var(--bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": SERVICES_FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />
      <Services />
      <FAQSection faqs={SERVICES_FAQS} />
    </main>
  );
}
