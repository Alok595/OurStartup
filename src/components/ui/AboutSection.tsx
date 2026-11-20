"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Shield, Zap } from "lucide-react";
import { Arrow, EASE, Magnetic, Reveal, Spark } from "@/components/ui/motion";
import PageHero from "@/components/ui/PageHero";

const PILLARS = [
  { label: "System design", icon: Cpu, bg: "#34D399", rot: -5 },
  { label: "Security first", icon: Shield, bg: "#60A5FA", rot: 4 },
  { label: "Extreme performance", icon: Zap, bg: "#FFD23F", rot: -2 },
];

const ADVANTAGES = [
  {
    title: "Scalable architecture",
    desc: "We don't hack things together. We architect distributed systems with Next.js, Docker and AWS that scale to millions of users.",
    color: "#34D399",
  },
  {
    title: "Algorithmic precision",
    desc: "Complex logic, deep integrations and AI pipelines handled with academic rigour. Hard maths and tricky routing are where we're at home.",
    color: "#FF8FB4",
  },
  {
    title: "Future-proof stacks",
    desc: "Modern, robust technology only — MERN, Next.js, React Native and PostgreSQL — so your product isn't legacy on day one.",
    color: "#60A5FA",
  },
];

export default function AboutSection() {
  return (
    <section className="relative w-full bg-[var(--bg)]">
      {/* Hero */}
      <PageHero
        label="About us"
        labelColor="var(--grape)"
        line1="Engineering"
        line2="built by"
        highlight="IIT minds."
        highlightBg="var(--sky)"
        description="We're a collective of engineers from the Indian Institutes of Technology. We don't just build websites — we architect scalable, high-performance digital infrastructure for startups and enterprises that refuse to compromise on quality."
        chips={[{ text: "IIT engineers" }, { text: "100% hand-coded", bg: "#FFD23F" }, { text: "India → everywhere", bg: "#34D399" }]}
        actions={
          <>
            <Magnetic>
              <Link href="/contact" className="btn btn-yolk !px-7 !py-5">
                Work with us <Arrow size={15} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/projects" className="btn btn-paper !px-7 !py-5">
                See the work
              </Link>
            </Magnetic>
          </>
        }
      />

      {/* Vision */}
      <div className="border-y-2 border-[var(--edge)] bg-[var(--paper)] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="label text-[var(--sub)]">(01) Our vision</p>
              <h2 className="f-display-narrow mt-5 text-5xl leading-[1] text-[var(--ink)] sm:text-6xl">
                Built right <span className="f-serif font-normal text-[var(--accent)]">the first time.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--sub)]">
              <p>
                The web is cluttered with disposable MVPs and fragile codebases that crack at the first sign of real scale. We want to
                replace that fragility with rigorous, production-grade engineering.
              </p>
              <p>
                Academic rigour plus deep systems knowledge means products that look great and are architected to handle serious load from
                day one.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="panel-grape halftone relative aspect-square w-full overflow-hidden border-2 border-[var(--edge)] shadow-[10px_10px_0_var(--shadow)]">
              <span aria-hidden className="f-display absolute -bottom-[0.12em] -left-[0.04em] select-none text-[42vw] leading-none text-white/10 lg:text-[22rem]">
                IIT
              </span>
              <Spark size={90} color="#FFD23F" className="spin-slow absolute right-8 top-8" />
              <div className="absolute inset-0 flex flex-col items-start justify-center gap-5 p-8 sm:p-12">
                {PILLARS.map((p, i) => (
                  <motion.span
                    key={p.label}
                    initial={{ opacity: 0, x: -40, rotate: 0 }}
                    whileInView={{ opacity: 1, x: 0, rotate: p.rot }}
                    whileHover={{ rotate: 0, scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 + i * 0.12 }}
                    className="flex items-center gap-3 border-2 border-[#0E0E10] px-5 py-4 text-[#0E0E10] shadow-[5px_5px_0_#0E0E10]"
                    style={{ backgroundColor: p.bg, marginLeft: i * 28 }}
                  >
                    <p.icon size={22} strokeWidth={2.4} />
                    <span className="f-display-narrow text-xl sm:text-2xl">{p.label}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Advantage */}
      <div className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <p className="label text-[var(--sub)]">(02) The IIT advantage</p>
              <h2 className="f-display mt-5 text-6xl text-[var(--ink)] sm:text-8xl">
                Why <span className="f-serif text-[var(--accent)]">us?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-lg text-[var(--sub)]">The problem-solving habits drilled into us at IIT, applied to your product.</p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {ADVANTAGES.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="card-pop flex flex-col"
              >
                <div className="relative flex h-40 items-end justify-between border-b-2 border-[var(--edge)] p-5" style={{ backgroundColor: a.color }}>
                  <span className="f-display text-8xl leading-[0.75] text-[#0E0E10]">0{i + 1}</span>
                  <Spark size={32} color="#0E0E10" />
                </div>
                <div className="p-6">
                  <h3 className="f-display-narrow text-2xl text-[var(--ink)]">{a.title}</h3>
                  <p className="mt-3 leading-relaxed text-[var(--sub)]">{a.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 border-2 border-[var(--edge)] bg-[var(--yolk)] p-8 text-[#0E0E10] shadow-[8px_8px_0_var(--shadow)] sm:flex-row sm:items-center sm:p-10">
            <p className="f-display-narrow text-3xl leading-tight sm:text-4xl">
              Got something hard to build? <span className="f-serif font-normal">Good.</span>
            </p>
            <Link href="/contact" className="btn btn-ink">
              Talk to an engineer <Arrow size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
