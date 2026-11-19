"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, Reveal } from "@/components/ui/motion";

const STEPS = [
  { n: "01", title: "Talk", body: "One call. We learn your goals, users and budget, then send a fixed-price plan." },
  { n: "02", title: "Sketch", body: "Wireframes and a clickable prototype. You approve the look before we build it." },
  { n: "03", title: "Build", body: "Two-week sprints. A live staging link and a demo every Friday." },
  { n: "04", title: "Launch", body: "Go live, tune speed, and stay on for 90 days of free fixes." },
];

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  // walk through the steps on its own until someone points at one
  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2600);
    return () => clearInterval(t);
  }, [hovering]);

  return (
    <section className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--lime)] px-5 py-14 text-[#0B1230] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="label">How we work</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="f-display mt-4 text-[11vw] uppercase leading-[0.9] sm:text-7xl lg:text-[6.2rem]">
            Four steps. <span className="text-[var(--cobalt)]">No surprises.</span>
          </h2>
        </Reveal>

        <ol
          className="mt-10 grid border-l-2 border-t-2 border-[#0B1230] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4"
          onMouseLeave={() => setHovering(false)}
        >
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                onMouseEnter={() => {
                  setHovering(true);
                  setActive(i);
                }}
                className="relative border-b-2 border-r-2 border-[#0B1230] p-6 sm:p-7"
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 origin-bottom bg-white transition-transform duration-500 ease-[var(--ease-out)] ${on ? "scale-y-100" : "scale-y-0"}`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="f-display text-6xl leading-none sm:text-7xl">{s.n}</span>
                    {i < STEPS.length - 1 && (
                      <span aria-hidden className={`hidden text-2xl transition-transform duration-300 lg:block ${on ? "translate-x-1" : ""}`}>
                        →
                      </span>
                    )}
                  </div>
                  <h3 className="f-display mt-6 text-2xl uppercase sm:mt-8">{s.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed">{s.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
