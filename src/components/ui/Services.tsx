"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Smartphone, Sparkles, Workflow, PenTool, Boxes } from "lucide-react";
import { Arrow, EASE, Marquee, Reveal, Spark, SplitWords } from "@/components/ui/motion";

type ServiceItem = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  icon: typeof Globe;
  included: string[];
  stack: string[];
  process: { label: string; detail: string }[];
};

const LOOK: Record<string, { panel: string; chip: string }> = {
  web: { panel: "panel-emerald", chip: "#34D399" },
  mobile: { panel: "panel-cobalt", chip: "#60A5FA" },
  ai: { panel: "panel-grape", chip: "#C4B5FD" },
  automation: { panel: "panel-flame", chip: "#FFD23F" },
  branding: { panel: "panel-grape", chip: "#FF8FB4" },
  custom: { panel: "panel-cobalt", chip: "#FFD23F" },
};

const SERVICES: ServiceItem[] = [
  {
    id: "web",
    index: "01",
    title: "Web Development",
    tagline: "Sites and dashboards built fast, built to last, built to be found.",
    description:
      "We design and ship production websites — from single-page brand sites to full multi-page platforms with authentication, payments, and content pipelines. Every build is optimized at the network, markup, and rendering level so it's fast on day one and easy to extend a year later.",
    icon: Globe,
    included: [
      "Single & multi-page websites",
      "E-commerce storefronts",
      "User authentication & accounts",
      "Legacy site rebuilds & fixes",
      "SEO & technical audits",
      "CMS integration",
      "Ongoing maintenance",
      "Performance tuning",
    ],
    stack: ["Next.js", "React", "Tailwind", "Stripe", "Sanity/Contentful"],
    process: [
      { label: "Audit", detail: "Map current stack, content, and traffic." },
      { label: "Build", detail: "Component-driven build with staging previews." },
      { label: "Launch", detail: "Perf pass, SEO pass, then cutover." },
    ],
  },
  {
    id: "mobile",
    index: "02",
    title: "Mobile Apps",
    tagline: "Native-feel iOS and Android products, launch to long-term support.",
    description:
      "We build mobile products that feel native because they largely are — smooth navigation, real push notifications, offline-first data, and App/Play Store submissions handled end to end. Post-launch we stay on as the team that ships the updates, not just the team that shipped v1.",
    icon: Smartphone,
    included: [
      "iOS native apps",
      "Android native apps",
      "Cross-platform (React Native)",
      "App Store & Play submission",
      "Push notifications",
      "In-app purchases",
      "Offline-first sync",
      "Post-launch support",
    ],
    stack: ["Swift", "Kotlin", "React Native", "Firebase", "RevenueCat"],
    process: [
      { label: "Prototype", detail: "Clickable prototype, tested on device." },
      { label: "Build", detail: "Parallel iOS/Android or cross-platform build." },
      { label: "Ship", detail: "Store review, phased rollout, monitoring." },
    ],
  },
  {
    id: "ai",
    index: "03",
    title: "AI Solutions",
    tagline: "Copilots and model integrations that work quietly inside your product.",
    description:
      "We embed AI where it actually earns its place — retrieval-backed copilots, document extraction, recommendation logic, and computer vision — wired into your real data with guardrails, evals, and fallback paths so it behaves predictably in production, not just in a demo.",
    icon: Sparkles,
    included: [
      "Chatbots & copilots",
      "Knowledge retrieval (RAG)",
      "Model integration & fine-tuning",
      "Recommendation engines",
      "Document extraction",
      "Computer vision",
      "AI guardrails & evals",
      "Workflow automation",
    ],
    stack: ["Claude API", "OpenAI", "LangChain", "Pinecone/pgvector", "Python"],
    process: [
      { label: "Scope", detail: "Define the task the model must reliably do." },
      { label: "Build", detail: "Retrieval, prompts, guardrails, eval suite." },
      { label: "Monitor", detail: "Track quality & cost once it's live." },
    ],
  },
  {
    id: "automation",
    index: "04",
    title: "Automation",
    tagline: "Resilient pipelines that quietly replace the busywork.",
    description:
      "We map the manual, repetitive parts of your operation and replace them with pipelines that just run — syncing CRMs and ERPs, generating reports on schedule, triggering notifications, and gluing your tools together through APIs, with monitoring so failures get caught, not discovered a week later.",
    icon: Workflow,
    included: [
      "Workflow automation",
      "CRM / ERP integrations",
      "Data pipelines",
      "Notification automation",
      "Internal dashboards",
      "Scheduled report generation",
      "Scheduled jobs",
      "Third-party API integrations",
    ],
    stack: ["Node.js", "Python", "Zapier/Make", "Airflow", "Postgres"],
    process: [
      { label: "Map", detail: "Diagram the current manual workflow." },
      { label: "Automate", detail: "Build the pipeline with error handling." },
      { label: "Watch", detail: "Alerting so failures surface immediately." },
    ],
  },
  {
    id: "branding",
    index: "05",
    title: "Branding",
    tagline: "Identity systems that stay consistent, pitch deck to shipped product.",
    description:
      "We build the identity layer that everything else sits on top of — logo, color, type, and voice — codified into guidelines and a working design system so your brand looks like one coherent thing whether it's on a business card, a pitch deck, or a live product screen.",
    icon: PenTool,
    included: [
      "Logo design",
      "Brand guidelines",
      "Design systems",
      "Business stationery",
      "Social media kits",
      "Pitch deck design",
      "Packaging design",
      "Brand messaging & voice",
    ],
    stack: ["Figma", "Illustrator", "Design Tokens", "Notion"],
    process: [
      { label: "Discover", detail: "Positioning, audience, competitive scan." },
      { label: "Design", detail: "Identity exploration, then system build-out." },
      { label: "Hand off", detail: "Guidelines + assets ready for every team." },
    ],
  },
  {
    id: "custom",
    index: "06",
    title: "Custom Software",
    tagline: "Bespoke systems shaped around how your team actually works.",
    description:
      "When off-the-shelf tools stop fitting, we build the software that does — internal tools, multi-tenant SaaS, admin dashboards, and the database architecture underneath them — engineered to scale with your team instead of getting rebuilt every time you outgrow the last version.",
    icon: Boxes,
    included: [
      "Bespoke platforms",
      "Internal tools",
      "SaaS development",
      "Database architecture",
      "Legacy modernization",
      "Admin dashboards",
      "Multi-tenant systems",
      "Ongoing development",
    ],
    stack: ["TypeScript", "PostgreSQL", "AWS/GCP", "Docker", "GraphQL"],
    process: [
      { label: "Architect", detail: "Data model & system design first." },
      { label: "Build", detail: "Iterative delivery in reviewable increments." },
      { label: "Scale", detail: "Stay on as usage and complexity grow." },
    ],
  },
];

export default function Services() {
  const [open, setOpen] = useState<string | null>("web");

  return (
    <section className="relative">
      {/* Intro */}
      <div className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pb-24">
        <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <p className="label flex items-center gap-2 text-[var(--sub)]">
              <span className="inline-block h-3 w-3 bg-[var(--accent)]" /> Services &amp; capabilities
            </p>
          </Reveal>
          <h1 className="f-display mt-6 text-[15vw] text-[var(--ink)] sm:text-[11vw] lg:text-[9.5rem]">
            <SplitWords text="Six ways" onMount />
            <br />
            <span className="f-serif text-[var(--accent)]">
              <SplitWords text="we can help." onMount delay={0.15} />
            </span>
          </h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <Reveal delay={0.3} className="lg:col-span-6 lg:col-start-7">
              <p className="text-xl leading-relaxed text-[var(--sub)]">
                Pick one, or stack a few — most clients start with a website and come back for the app, the automation and the AI
                layer on top. Open a row to see exactly what&apos;s included.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Index */}
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8">
        <div className="border-t-[3px] border-[var(--edge)]">
          {SERVICES.map((s, i) => {
            const isOpen = open === s.id;
            const look = LOOK[s.id];
            return (
              <Reveal key={s.id} delay={i * 0.04} className="border-b-[3px] border-[var(--edge)]">
                <button
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  aria-expanded={isOpen}
                  className="group relative flex w-full items-center gap-4 overflow-hidden py-6 text-left sm:gap-8 sm:py-8"
                >
                  {!isOpen && (
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100"
                      style={{ backgroundColor: look.chip }}
                    />
                  )}
                  <span className="label relative w-8 shrink-0 pl-1 text-[var(--sub)] transition-colors group-hover:text-[#0E0E10]">{s.index}</span>
                  <span className="relative flex-1">
                    <span
                      className={`f-display block text-[9vw] transition-[color,transform] duration-500 ease-[var(--ease-out)] sm:text-6xl lg:text-7xl ${
                        isOpen ? "text-[var(--accent)]" : "text-[var(--ink)] group-hover:translate-x-3 group-hover:text-[#0E0E10]"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className={`mt-2 max-w-xl text-[var(--sub)] transition-colors group-hover:text-[#0E0E10] ${isOpen ? "hidden" : "hidden sm:block"}`}>
                      {s.tagline}
                    </span>
                  </span>
                  <span
                    className={`relative grid h-12 w-12 shrink-0 place-items-center border-2 border-[var(--edge)] transition-all duration-300 sm:h-16 sm:w-16 ${
                      isOpen ? "bg-[var(--yolk)] text-[#0E0E10]" : "text-[var(--ink)] group-hover:border-[#0E0E10] group-hover:text-[#0E0E10]"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <ServicePanel s={s} panel={look.panel} chip={look.chip} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Band */}
      <div className="my-16 -rotate-[1.5deg] border-y-[3px] border-[var(--edge)] bg-[var(--yolk)] py-4 text-[#0E0E10]">
        <Marquee speed={34}>
          {SERVICES.map((s) => (
            <span key={s.id} className="flex items-center gap-6 pr-6">
              <span className="f-display whitespace-nowrap text-4xl sm:text-5xl">{s.title}</span>
              <Spark size={24} color="#0E0E10" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function ServicePanel({ s, panel, chip }: { s: ServiceItem; panel: string; chip: string }) {
  const Icon = s.icon;
  return (
    <div className={`${panel} halftone mb-8 grid gap-10 border-2 border-[var(--edge)] p-6 sm:p-10 lg:grid-cols-12`}>
      <div className="lg:col-span-5">
        <span className="grid h-16 w-16 place-items-center border-2 border-[#0E0E10] text-[#0E0E10] shadow-[4px_4px_0_#0E0E10]" style={{ backgroundColor: chip }}>
          <Icon size={28} strokeWidth={2} />
        </span>
        <p className="f-serif mt-8 text-3xl leading-tight">{s.tagline}</p>
        <p className="mt-5 text-[16px] leading-relaxed opacity-85">{s.description}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {s.stack.map((t) => (
            <span key={t} className="label border border-white/50 px-2.5 py-1.5 !text-[10px]">
              {t}
            </span>
          ))}
        </div>
        <Link href="/contact" className="btn btn-yolk mt-9">
          Start a {s.title.toLowerCase()} project <Arrow size={14} />
        </Link>
      </div>

      <div className="lg:col-span-7">
        <p className="label opacity-70">What&apos;s included</p>
        <ul className="mt-4 grid border-l border-t border-white/25 sm:grid-cols-2">
          {s.included.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.4, ease: EASE }}
              className="flex items-center gap-3 border-b border-r border-white/25 px-4 py-3.5 text-[15px] font-medium"
            >
              <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: chip }} />
              {item}
            </motion.li>
          ))}
        </ul>

        <p className="label mt-10 opacity-70">How it runs</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.process.map((p, i) => (
            <li key={p.label} className="border-2 border-[#0E0E10] bg-[#FFFDF8] p-4 text-[#0E0E10] shadow-[4px_4px_0_#0E0E10]">
              <span className="label opacity-60">Step {i + 1}</span>
              <span className="f-display-narrow mt-2 block text-xl">{p.label}</span>
              <span className="mt-1 block text-sm leading-snug opacity-75">{p.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
