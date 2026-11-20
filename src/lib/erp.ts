// Client-safe ERP content (no database imports here).
import type { ProjectItem } from "@/lib/portfolio";

export const TECHKHATA_URL = "https://techkhata.vercel.app/";
export const WHATSAPP_NUMBER = "916202585952";

export const erpDemoLink = (name: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I want a demo of the ${name} ERP`)}`;

/** What every ERP can be customised with — shown on /erp, the home section and detail pages. */
export const ERP_CUSTOMISE = [
  "Your logo, colours and invoice format",
  "Add or remove modules to fit your workflow",
  "Custom fields, reports and dashboards",
  "Integrations — payments, SMS, WhatsApp, Tally",
  "Your own domain and Android / iOS app",
  "Data migration from Excel or old software",
];

/** Other ERPs we build on the same core, tailored per business. */
export const ERP_VERTICALS = [
  { title: "Retail & POS", body: "Billing, barcode stock and loyalty for shops and chains." },
  { title: "Distribution", body: "Orders, dispatch, route sales and party-wise ledgers." },
  { title: "Manufacturing", body: "BOM, production planning, raw material and job work." },
  { title: "Clinics & Labs", body: "Appointments, patient records, billing and reports." },
  { title: "Schools & Institutes", body: "Admissions, fees, attendance and results." },
  { title: "Service businesses", body: "Jobs, field staff, AMC contracts and invoicing." },
];

/**
 * Built-in ERPs shown while the database has none marked as ERP.
 * The admin "ERP Systems" page can import these into the database in one click.
 */
export const DEFAULT_ERPS: ProjectItem[] = [
  {
    _id: "default-techkhata",
    title: "TechKhata — Mobile Shop Management System",
    slug: "techkhata-mobile-shop-erp",
    category: "ERP System",
    color: "#4F46E5",
    description:
      "The complete ERP for mobile shops — billing, IMEI-wise stock, repairs, khata and profit reports in one app.",
    liveUrl: TECHKHATA_URL,
    heroImage: "/images/erp/techkhata-dashboard.png",
    gallery: ["/images/erp/techkhata-inventory.png"],
    badge: "Featured",
    freeTrial: true,
    isErp: true,
    showInWork: true,
    erpFeatured: true,
    erpFeatures: [
      "Billing & GST invoices",
      "IMEI-wise inventory",
      "Repair & service jobs",
      "Digital khata",
      "Purchases & suppliers",
      "Reports & P&L",
      "Staff & roles",
      "Multi-branch",
    ],
    overview:
      "Built for mobile retailers, repair centres and distributors. Track every handset by IMEI, bill in seconds with GST invoices, manage repair jobs, keep customer and supplier khata, and see your profit live — from the counter or your phone.",
    challenge:
      "Mobile shops juggle registers, Excel sheets and WhatsApp notes for stock, repairs and udhaar. Handsets go missing, dues are forgotten and nobody knows the real profit.",
    solution:
      "One system for the whole shop: IMEI-level stock, fast POS billing, repair job cards, digital khata with reminders and live dashboards for revenue, visits, categories and payment modes.",
    services: ["ERP", "Web App", "Inventory", "Billing"],
  },
  {
    _id: "default-star-pharma",
    title: "Star Pharma — Pharmacy Management System",
    slug: "star-pharma-pharmacy-erp",
    category: "ERP System",
    color: "#059669",
    description:
      "The ERP for medical stores, pharmacies and distributors — batches, expiry and GST billing sorted.",
    freeTrial: false,
    isErp: true,
    showInWork: true,
    erpFeatured: true,
    erpFeatures: [
      "Fast GST billing",
      "Batch & expiry tracking",
      "Purchase & distributors",
      "Salt / substitute search",
      "Patients & prescriptions",
      "Reports & profit",
    ],
    overview:
      "Built for chemists, pharmacies and pharma distributors. Bill fast with GST invoices, track every medicine by batch and expiry, manage purchases from distributors, keep patient and doctor records, and stop losing money to expired stock.",
    challenge: "Expired stock, slow billing at rush hour and messy distributor ledgers eat straight into pharmacy margins.",
    solution:
      "Batch-wise stock with expiry alerts, medicine search by name, salt or barcode, purchase bills with schemes and credit notes, and clear GST and margin reports.",
    services: ["ERP", "Web App", "Pharmacy"],
  },
];

/** Live link for an ERP, else a WhatsApp demo request. */
export const erpCta = (erp: Pick<ProjectItem, "liveUrl" | "title" | "freeTrial">) =>
  erp.liveUrl
    ? { href: erp.liveUrl, label: erp.freeTrial ? "Start free trial" : "Open live app" }
    : { href: erpDemoLink(erp.title), label: "Book a free demo" };

/** Short display name: "TechKhata — Mobile Shop…" → { brand: "TechKhata", name: "Mobile Shop…" } */
export function splitErpTitle(title: string) {
  const [brand, ...rest] = title.split(/\s+[—–-]\s+/);
  return rest.length ? { brand, name: rest.join(" — ") } : { brand: "", name: title };
}

export function erpImages(erp: Pick<ProjectItem, "heroImage" | "gallery">) {
  return [erp.heroImage, ...(erp.gallery || [])].filter(Boolean) as string[];
}
