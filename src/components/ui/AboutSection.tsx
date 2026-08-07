"use client";

import { motion } from "framer-motion";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Zap, Code, Shield, Cpu, ChevronRight } from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function AboutSection() {
  return (
    <section className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen w-full bg-[var(--bg)] pt-32 pb-24 overflow-hidden`}>
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:64px_64px]" />
      
      {/* Accent Glows */}
      <div
        className="pointer-events-none absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ backgroundColor: "#5B45CF", opacity: 0.12 }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] bottom-[10%] h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ backgroundColor: "#0C9C89", opacity: 0.1 }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)]/50 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[var(--sub)] backdrop-blur-sm sm:text-[12px]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B45CF]" />
            ABOUT US
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[4.5rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Engineering at the core.<br className="hidden sm:block" />
            <span className="text-[var(--sub)]">Built by IIT minds.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--sub)] sm:text-lg"
          >
            We are a collective of engineers from the Indian Institutes of Technology (IIT). We don't just build websites; we architect scalable, high-performance digital infrastructure for startups and enterprises that refuse to compromise on quality.
          </motion.p>
        </div>

        {/* VISION SECTION */}
        <div className="mt-32 grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2
              className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Vision
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[var(--sub)] sm:text-base">
              <p>
                The digital landscape is cluttered with disposable MVPs and fragile codebases that break under the first sign of real scale. Our vision is to replace that fragility with rigorous, production-grade engineering.
              </p>
              <p>
                We believe software should be built right the first time. By applying our academic rigor and deep systems knowledge, we craft solutions that are not only visually stunning but are fundamentally architected to handle massive scale from day one.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Cpu className="text-[#0C9C89]" size={18} />
                System Design
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Shield className="text-[#5B45CF]" size={18} />
                Security First
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Zap className="text-[#D9600A]" size={18} />
                Extreme Performance
              </div>
            </div>
          </motion.div>

          {/* Abstract geometric visual representing scale/structure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border border-[var(--line)] bg-[var(--bg)]/50 p-8 backdrop-blur-md mx-auto lg:ml-auto"
          >
            <div className="absolute inset-0 rounded-3xl [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            
            <div className="relative z-10 grid h-full w-full grid-cols-2 grid-rows-2 gap-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] transition-colors hover:border-[#5B45CF]" />
              <div className="rounded-2xl border border-[var(--line)] bg-[#5B45CF]/10 transition-colors hover:border-[#5B45CF]" />
              <div className="rounded-2xl border border-[var(--line)] bg-[#0C9C89]/10 transition-colors hover:border-[#0C9C89]" />
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] transition-colors hover:border-[#0C9C89]" />
            </div>

            <div className="absolute flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-xl">
              <Code size={24} className="text-[var(--ink)]" />
            </div>
          </motion.div>
        </div>

        {/* TEAM EXPERTISE GRID */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2
              className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The IIT Advantage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-[var(--sub)]">
              We bring the problem-solving mentality drilled into us at IIT to every client project. Here’s what that means for your product.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Scalable Architecture",
                desc: "We don't hack things together. We architect distributed systems using Next.js, Docker, and AWS that scale to millions of users effortlessly.",
                color: "#5B45CF"
              },
              {
                title: "Algorithmic Precision",
                desc: "Complex logic, deep integrations, and AI pipelines are handled with academic rigor. If it involves hard math or complex routing, we excel at it.",
                color: "#0C9C89"
              },
              {
                title: "Future-Proof Stacks",
                desc: "We exclusively build on modern, robust technologies. MERN, Next.js, React Native, and PostgreSQL ensure your product isn't legacy on day one.",
                color: "#D9600A"
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--bg)]/30 p-8 transition-colors hover:bg-[var(--bg)]"
              >
                <div>
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)]" style={{ backgroundColor: `${feature.color}14` }}>
                    <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: feature.color }} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[var(--sub)]">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
