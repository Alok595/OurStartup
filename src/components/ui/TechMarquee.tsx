"use client";

import { motion } from "framer-motion";

const TECHNOLOGIES = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
  "PostgreSQL",
  "GraphQL",
  "AWS",
  "Docker",
  "Framer Motion",
  "Python"
];

export default function TechMarquee() {
  // Duplicate array to create a seamless infinite loop
  const duplicateTechs = [...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section className="border-b border-[var(--line)] bg-[var(--bg)] py-12 overflow-hidden">
      <div className="flex flex-col items-center gap-8">
        
        <h3 
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]" 
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Our Tech Stack
        </h3>

        <div className="relative w-full flex overflow-hidden group">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-40" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-40" />
          
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
            className="flex w-max items-center gap-12 sm:gap-24 px-6"
          >
            {duplicateTechs.map((tech, idx) => (
              <span
                key={idx}
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] opacity-70 transition-all hover:opacity-100 hover:text-[var(--accent)] cursor-default" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
