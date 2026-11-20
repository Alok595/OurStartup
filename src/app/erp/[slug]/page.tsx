import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ErpDetailView from "@/components/ui/ErpDetailView";
import { getErpBySlug, getErpList } from "@/lib/portfolio";

export const revalidate = 60;

export async function generateStaticParams() {
  const erps = await getErpList();
  return erps.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const erp = await getErpBySlug(slug);
  if (!erp) return { title: "ERP Not Found" };
  return {
    title: `${erp.title} | ERP System`,
    description: erp.description,
    openGraph: {
      title: `${erp.title} | GenZDevWorks ERP`,
      description: erp.description,
      images: erp.heroImage ? [{ url: erp.heroImage }] : [],
    },
  };
}

export default async function ErpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const erps = await getErpList();
  const erp = erps.find((e) => e.slug === slug);
  if (!erp) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: erp.title,
            description: erp.description,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web, Android, iOS",
            ...(erp.liveUrl ? { url: erp.liveUrl } : {}),
            ...(erp.heroImage ? { screenshot: erp.heroImage } : {}),
            ...(erp.freeTrial ? { offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "Free trial" } } : {}),
          }),
        }}
      />
      <ErpDetailView erp={erp} others={erps.filter((e) => e.slug !== slug)} />
    </>
  );
}
