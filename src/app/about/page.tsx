import { Metadata } from "next";
import AboutSection from "@/components/ui/AboutSection";
import FAQSection from "@/components/ui/FAQSection";

export const metadata: Metadata = {
  title: "About Us | IIT Engineers building scalable products",
  description: "Learn about our vision and our team of IIT engineers dedicated to crafting scalable, premium software for startups and enterprises.",
};

const ABOUT_FAQS = [
  {
    q: "Who is GenZDevWorks?",
    a: "We are a technology-driven software development agency founded by IIT engineers. We help startups and enterprises build high-quality digital products, AI solutions, and mobile apps.",
  },
  {
    q: "What makes your team different?",
    a: "Our strong engineering background allows us to build highly scalable and secure architectures, while our design-first approach ensures the user experience is always premium and modern.",
  },
  {
    q: "Do you work with global clients?",
    a: "Absolutely. We are a remote-first agency and collaborate seamlessly with clients across different time zones worldwide.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ABOUT_FAQS.map((faq) => ({
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
      <AboutSection />
      <div className="w-full bg-[var(--bg)]">
        <FAQSection faqs={ABOUT_FAQS} title="About Us - FAQs" />
      </div>
    </main>
  );
}
