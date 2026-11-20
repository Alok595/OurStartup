import type { Metadata } from "next";
import ErpPage from "@/components/ui/ErpPage";
import FAQSection from "@/components/ui/FAQSection";
import { getErpList } from "@/lib/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ERP Systems — Mobile Shop Management & Custom ERP",
  description:
    "Fully customisable ERP systems by GenZDevWorks. TechKhata for mobile shops and Star Pharma for pharmacies — billing, inventory, batch & expiry, repairs and khata. Free trial available.",
};

const ERP_FAQS = [
  {
    q: "Is there a free trial?",
    a: "Yes. ERPs marked \"Free trial\" — like TechKhata for mobile shops — can be tried right away with no setup. For the others, book a free demo and we'll walk you through it.",
  },
  {
    q: "Can the ERP be customised for my business?",
    a: "Completely. We change branding, invoice formats, modules, fields, reports and integrations to fit your workflow, and can build a fully custom ERP for any industry.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. Our ERPs run in the browser on desktop, tablet and phone, and we can ship a dedicated Android / iOS app with your branding.",
  },
  {
    q: "Can you move my existing data?",
    a: "Yes. We migrate customers, stock and ledgers from Excel or your old software so you can switch without starting from zero.",
  },
];

export default async function Page() {
  const erps = await getErpList();
  return (
    <main className="min-h-screen w-full bg-[var(--bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: erps.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "SoftwareApplication",
                name: e.title,
                description: e.description,
                applicationCategory: "BusinessApplication",
                ...(e.liveUrl ? { url: e.liveUrl } : {}),
                ...(e.freeTrial ? { offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "Free trial" } } : {}),
              },
            })),
          }),
        }}
      />
      <ErpPage erps={erps} />
      <div className="border-t-2 border-[var(--edge)]">
        <FAQSection faqs={ERP_FAQS} title="ERP questions, answered." />
      </div>
    </main>
  );
}
