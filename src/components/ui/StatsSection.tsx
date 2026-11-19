"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, CountUp, EASE, Reveal, Spark, SplitWords } from "@/components/ui/motion";

type Stat = { value: string; sub: string; title: string; body: string; tag: string; hover: string };

const STATS: Stat[] = [
  {
    value: "15+",
    sub: "shipped in 30 days",
    title: "Websites developed last month",
    body: "Web apps, marketing platforms and business systems deployed with sub-second load times.",
    tag: "Delivery velocity",
    hover: "#FFD23F",
  },
  {
    value: "₹1L+",
    sub: "₹1,00,000+ unlocked",
    title: "Revenue generated through our software",
    body: "Bookings, transactions and enterprise growth driven by the systems we built for clients.",
    tag: "Business impact",
    hover: "#FF8FB4",
  },
  {
    value: "90%+",
    sub: "organic discovery",
    title: "Customers returning via Google",
    body: "Repeat visitors and organic acquisition through semantic SEO, clean metadata and top rankings.",
    tag: "Search",
    hover: "#60A5FA",
  },
  {
    value: "3x",
    sub: "rapid sprints",
    title: "Faster go-to-market",
    body: "Concept to production in weeks — about a third of the usual agency timeline.",
    tag: "Speed",
    hover: "#FF9A6B",
  },
  {
    value: "99.9%",
    sub: "zero-downtime deploys",
    title: "Production uptime",
    body: "Fault-tolerant cloud infrastructure that holds steady through traffic spikes.",
    tag: "Reliability",
    hover: "#C4B5FD",
  },
  {
    value: "4.9★",
    sub: "across 25+ clients",
    title: "Client satisfaction score",
    body: "Build quality and post-launch support that founders keep rating five stars.",
    tag: "Trust",
    hover: "#FFD23F",
  },
];

export default function StatsSection() {
  return (
    <section className="panel-emerald halftone relative overflow-hidden border-t-2 border-[var(--edge)] px-5 py-14 sm:px-8 sm:py-20">
      <Spark size={220} color="rgba(255,255,255,0.06)" className="spin-slow pointer-events-none absolute -right-16 top-10" />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="label flex items-center gap-2 text-white/70">
                <span className="inline-block h-3 w-3 bg-[var(--yolk)]" /> (03) The receipts
              </p>
            </Reveal>
            <h2 className="f-display mt-6 text-[11vw] sm:text-7xl lg:text-[6.2rem]">
              <SplitWords text="Numbers," />
              <br />
              <span className="f-serif text-[1.05em] text-[var(--yolk)]">
                <SplitWords text="not adjectives." delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-lg text-white/80">Every figure below comes from live client projects, not a pitch deck.</p>
            <Link href="/projects" className="btn btn-yolk mt-6">
              See the proof <Arrow size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid border-l-2 border-t-2 border-white/25 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
              className="group relative overflow-hidden border-b-2 border-r-2 border-white/25 p-6 sm:p-7"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100"
                style={{ backgroundColor: s.hover }}
              />
              <div className="relative transition-colors duration-300 group-hover:text-[#0E0E10]">
                <div className="flex items-center justify-between">
                  <span className="label opacity-70">{s.tag}</span>
                  <span className="label opacity-50">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <CountUp value={s.value} className="f-display mt-5 block text-6xl tabular-nums sm:text-7xl" />
                <p className="f-serif mt-2 text-2xl opacity-80">{s.sub}</p>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed opacity-75">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
