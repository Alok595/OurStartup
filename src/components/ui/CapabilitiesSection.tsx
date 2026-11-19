"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, EASE, Reveal } from "@/components/ui/motion";

const THINGS = [
  { title: "Web apps", body: "Fast sites and portals. Clean code, good SEO, no bloat." },
  { title: "Mobile", body: "iOS and Android apps in Flutter or React Native, built to feel native." },
  { title: "SaaS", body: "From first sketch to a product with billing, roles and analytics." },
  { title: "AI tools", body: "Copilots, chatbots and document tools wired into your real data." },
  { title: "Automation", body: "Pipelines and integrations that replace the copy-paste busywork." },
  { title: "Branding", body: "Logo, type and colour systems that look the same everywhere." },
];

export default function CapabilitiesSection() {
  return (
    <section className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--navy)] px-5 py-14 text-[#F3F4FA] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="label text-[var(--lime)]">What we do</p>
            <h2 className="f-display mt-4 text-[11vw] uppercase leading-[0.9] sm:text-7xl lg:text-[6.2rem]">
              Six things. <span className="text-[var(--bubblegum)]">One team.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/services" className="btn btn-yolk">
              All services <Arrow size={14} />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-10 grid border-l border-t border-white/70 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {THINGS.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE }}
              className="border-b border-r border-white/70"
            >
              <Link href="/services" className="group relative flex h-full flex-col p-6 sm:p-8">
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-[var(--lime)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
                />
                <span className="relative flex items-center justify-between">
                  <span className="f-mono text-sm text-[var(--lime)] transition-colors group-hover:text-[#0B1230]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[#0B1230] opacity-0 transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100">
                    <Arrow size={20} />
                  </span>
                </span>
                <h3 className="f-display relative mt-8 text-2xl uppercase transition-colors group-hover:text-[#0B1230] sm:mt-12 sm:text-3xl">{t.title}</h3>
                <p className="relative mt-2 max-w-xs text-[16px] leading-relaxed text-white/80 transition-colors group-hover:text-[#0B1230]">{t.body}</p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
