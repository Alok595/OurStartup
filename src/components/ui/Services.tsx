"use client";

/**
 * Services.tsx
 * ----------------------------------------------------------------------------
 * "Our Expertise" — v2. Completely different structure from the previous
 * full-screen snap-panel version.
 *
 * THE IDEA
 * A single section pins to the viewport while the user scrolls. While it's
 * pinned, a horizontal card track glides left underneath a sticky detail
 * panel on the left — think editorial/portfolio-site "scrollytelling"
 * rather than a slideshow. The left panel always shows the FULL detail
 * (description, what's included, tools/stack, process) for whichever card
 * currently sits centered in the viewport, so scrolling reads like flipping
 * through pages of a dossier rather than jumping between disconnected
 * screens.
 *
 * MOTION LAYERS
 * 1. GSAP ScrollTrigger pins the section and drives one master horizontal
 *    tween (`x` on the track) tied to normal vertical scroll distance.
 * 2. Each card gets its OWN ScrollTrigger using `containerAnimation` (the
 *    master tween) so it can fade/scale/rotate in as it enters the
 *    viewport and settle to full opacity/scale when centered — a classic
 *    "flip through a deck" effect.
 * 3. The left detail panel's content cross-fades via GSAP whenever the
 *    active index changes (driven by the master tween's onUpdate).
 * 4. Framer Motion handles micro-interactions: tap/hover lift on chips,
 *    the dot-nav, and the mobile accordion cards.
 *
 * MOBILE
 * Horizontal-scroll-pin is a poor fit for small screens (fighting native
 * scroll, awkward card widths). Below `lg` we swap to a plain vertical
 * accordion list — same data, same level of detail, native scroll,
 * Framer Motion height/opacity transitions on expand.
 *
 * Requires the same CSS custom properties as the rest of the page on an
 * ancestor: --bg, --ink, --sub, --line.
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import {
  Globe,
  Smartphone,
  Sparkles,
  Workflow,
  PenTool,
  Boxes,
  ArrowUpRight,
  Check,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

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
  accentLight: string;
  accentDark: string;
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
    accentLight: "#D9600A",
    accentDark: "#FF8A3D",
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
    accentLight: "#5B45CF",
    accentDark: "#9C8CFF",
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
    accentLight: "#0C9C89",
    accentDark: "#4FE8D0",
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
    accentLight: "#0C9C89",
    accentDark: "#4FE8D0",
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
    accentLight: "#5B45CF",
    accentDark: "#9C8CFF",
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
    accentLight: "#D9600A",
    accentDark: "#FF8A3D",
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: Pin and scroll track vertically
      const getDistance = () => track.scrollHeight - window.innerHeight;

      gsap.to(track, {
        y: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.round(progress * (SERVICES.length - 1));
            setActive((prev) => (prev === idx ? prev : idx));
            if (progressFillRef.current) {
              gsap.set(progressFillRef.current, { scaleX: progress });
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  const jumpTo = (i: number) => {
    const st = ScrollTrigger.getAll().find((t) => t.vars.trigger === containerRef.current);
    if (!st) return;
    const target = st.start + (i / (SERVICES.length - 1)) * (st.end - st.start);
    gsap.to(window, { scrollTo: target, duration: 0.9, ease: "power2.inOut" });
  };

  return (
    <section className={`${display.variable} ${body.variable} ${mono.variable} relative bg-[var(--bg)]`}>
      <div ref={containerRef} className="relative lg:h-screen w-full lg:overflow-hidden">
        
        {/* sticky header: jump-dots, progress rail */}
        <div className="absolute inset-x-0 top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-md">
          <div className="relative flex items-center justify-end px-6 py-5 sm:px-10">
            <h2
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Expertise
            </h2>

            <div className="flex items-center gap-4">
              <span className="text-[11px] tracking-[0.2em] text-[var(--sub)] sm:hidden" style={{ fontFamily: "var(--font-mono)" }}>
                0{active + 1} / 06
              </span>
              <div className="hidden items-center gap-2.5 sm:flex">
                {SERVICES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(i)}
                    type="button"
                    aria-label={`Go to ${s.title}`}
                    className="h-2 rounded-full border border-[var(--line)] transition-all duration-300"
                    style={{
                      width: i === active ? 22 : 8,
                      backgroundColor: i === active ? s.accentLight : "transparent",
                      borderColor: i === active ? s.accentLight : "var(--line)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative h-px w-full bg-[var(--line)]">
            <div ref={progressFillRef} className="h-full w-full origin-left scale-x-0 bg-[var(--ink)]" />
          </div>
        </div>

        {/* Scrolling track */}
        <div ref={trackRef} className="relative w-full will-change-transform">
          {SERVICES.map((service) => (
            <ServicePanel key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SERVICE PANEL — one full-screen "chapter"
// ---------------------------------------------------------------------------
function ServicePanel({ service }: { service: ServiceItem }) {
  return (
    <section
      className="relative flex min-h-screen py-24 w-full flex-col justify-center overflow-hidden border-b border-[var(--line)] px-6 sm:px-10 [--accent:var(--accent-light)] dark:[--accent:var(--accent-dark)]"
      style={{ "--accent-light": service.accentLight, "--accent-dark": service.accentDark } as React.CSSProperties}
    >
      {/* parallax background numeral */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4">
        <motion.span
          initial={{ y: -50 }}
          whileInView={{ y: 50 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="select-none text-[42vw] font-bold leading-none text-[var(--ink)] opacity-[0.035] sm:text-[24vw] lg:text-[20vw]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {service.index}
        </motion.span>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div
        className="pointer-events-none absolute right-[-12%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full blur-[130px]"
        style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 pt-16 sm:gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
        
        {/* Left Column: Intro & Process */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 flex items-center gap-4">
              <span
                className="text-6xl font-bold leading-none opacity-90"
                style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
              >
                {service.index}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                <service.icon size={20} color="var(--accent)" strokeWidth={1.75} />
              </div>
            </div>

            <h3
              className="text-[2.1rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)] xl:text-[2.4rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {service.title}
            </h3>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--sub)]">{service.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:mt-12 sm:flex-row sm:gap-6 sm:pt-8"
          >
            {service.process.map((step, i) => (
              <div key={step.label} className="flex-1">
                <span
                  className="text-[10.5px] tracking-[0.16em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                >
                  0{i + 1} · {step.label}
                </span>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--sub)]">{step.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Included & Stack */}
        <div className="flex flex-col gap-8 rounded-3xl border border-[var(--line)] bg-[var(--bg)]/50 p-6 backdrop-blur-md sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)" }}>
              What's Included
            </h4>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-[var(--sub)]">
                  <Check size={14} className="mt-[3px] shrink-0" color="var(--accent)" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[var(--line)] pt-6"
          >
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)" }}>
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--sub)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}