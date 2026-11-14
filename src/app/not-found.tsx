"use client";

/**
 * NotFound.tsx
 * ----------------------------------------------------------------------------
 * A proper illustrated 404 — not just bigger text. A hand-drawn, line-art
 * SVG scene sits above the copy: an astronaut adrift, snapped tether,
 * scanning radar rings, a distant blinking satellite, a ringed planet,
 * drifting asteroids, and a twinkling starfield. Everything is stroke-only
 * (no fills) so it matches the site's line/border design language instead
 * of looking like a dropped-in stock illustration.
 *
 * MOTION
 * - Mouse-parallax: three depth layers (far / mid / near) translate at
 *   different rates off a spring-smoothed pointer position.
 * - Path draw-on: helmet, radar rings, tether cord, and orbit trail animate
 *   in via `pathLength` 0→1 on mount (Framer Motion's SVG "draw" recipe).
 * - Ambient loops: astronaut bob, radar sweep rotation, satellite blink,
 *   star twinkle, asteroid drift, "?" bubble pulse — all infinite, all
 *   lightweight (opacity/transform only).
 * - The 404 numeral keeps a glitch double-shadow, now with an occasional
 *   jitter animation instead of a static offset.
 *
 * Requires --bg, --ink, --sub, --line, --accent on an ancestor, same as the
 * rest of the site.
 * ----------------------------------------------------------------------------
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";

const STARS = [
  { x: 40, y: 30, r: 1.4, d: 2.4 },
  { x: 90, y: 70, r: 1, d: 3.1 },
  { x: 150, y: 24, r: 1.6, d: 2.8 },
  { x: 210, y: 55, r: 1, d: 3.6 },
  { x: 20, y: 140, r: 1.2, d: 2.2 },
  { x: 70, y: 200, r: 1, d: 3.3 },
  { x: 260, y: 20, r: 1.3, d: 2.6 },
  { x: 320, y: 90, r: 1, d: 3.9 },
  { x: 380, y: 40, r: 1.5, d: 2.3 },
  { x: 460, y: 100, r: 1, d: 3.2 },
  { x: 470, y: 220, r: 1.2, d: 2.7 },
  { x: 30, y: 260, r: 1, d: 3.5 },
  { x: 130, y: 280, r: 1.3, d: 2.9 },
  { x: 240, y: 270, r: 1, d: 3.1 },
  { x: 400, y: 260, r: 1.4, d: 2.4 },
  { x: 350, y: 160, r: 1, d: 3.7 },
  { x: 110, y: 110, r: 1, d: 3 },
  { x: 190, y: 150, r: 1.1, d: 2.5 },
];

const ASTEROIDS = [
  { cx: 60, cy: 100, s: 1, dur: 7 },
  { cx: 440, cy: 180, s: 0.8, dur: 9 },
  { cx: 410, cy: 60, s: 0.65, dur: 6 },
];

export default function NotFound() {
  const router = useRouter();
  const sceneRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 });

  const farX = useTransform(springX, (v) => v * 10);
  const farY = useTransform(springY, (v) => v * 8);
  const midX = useTransform(springX, (v) => v * 18);
  const midY = useTransform(springY, (v) => v * 14);
  const nearX = useTransform(springX, (v) => v * 30);
  const nearY = useTransform(springY, (v) => v * 22);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetParallax = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[30%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/10 blur-[130px]" />

      {/* ------------------------------------------------------------------ */}
      {/* SVG SCENE                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetParallax}
        className="relative z-10 mb-2 h-[260px] w-full max-w-xl sm:h-[320px] md:h-[380px]"
      >
        <svg viewBox="0 0 500 320" className="h-full w-full overflow-visible" fill="none">
          {/* -------- far layer: stars, planet, distant satellite -------- */}
          <motion.g style={{ x: farX, y: farY }}>
            {STARS.map((s, i) => (
              <motion.circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="var(--sub)"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: [0.15, 0.9, 0.15] }}
                transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              />
            ))}

            {/* ringed planet */}
            <g transform="translate(430 55)">
              <motion.circle
                cx="0"
                cy="0"
                r="26"
                stroke="var(--line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <circle cx="-8" cy="-6" r="2.5" stroke="var(--sub)" strokeWidth="1" opacity={0.6} />
              <circle cx="7" cy="9" r="1.6" stroke="var(--sub)" strokeWidth="1" opacity={0.6} />
              <motion.ellipse
                cx="0"
                cy="0"
                rx="42"
                ry="10"
                stroke="var(--accent)"
                strokeWidth="1.2"
                opacity={0.45}
                transform="rotate(-18)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              />
            </g>

            {/* distant satellite, top-left */}
            <g transform="translate(55 45)">
              <rect x="-6" y="-4" width="12" height="8" rx="1.5" stroke="var(--sub)" strokeWidth="1.2" />
              <line x1="-6" y1="0" x2="-16" y2="-6" stroke="var(--sub)" strokeWidth="1.2" />
              <line x1="-6" y1="0" x2="-16" y2="6" stroke="var(--sub)" strokeWidth="1.2" />
              <line x1="6" y1="0" x2="16" y2="-6" stroke="var(--sub)" strokeWidth="1.2" />
              <line x1="6" y1="0" x2="16" y2="6" stroke="var(--sub)" strokeWidth="1.2" />
              <line x1="0" y1="-4" x2="0" y2="-11" stroke="var(--sub)" strokeWidth="1.2" />
              <motion.circle
                cx="0"
                cy="-13"
                r="1.6"
                fill="var(--accent)"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          </motion.g>

          {/* -------- mid layer: orbit trail, asteroids -------- */}
          <motion.g style={{ x: midX, y: midY }}>
            <motion.ellipse
              cx="210"
              cy="180"
              rx="150"
              ry="70"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            />

            {ASTEROIDS.map((a, i) => (
              <motion.g
                key={i}
                animate={{ x: [0, 12, 0], y: [0, -8, 0], rotate: [0, 12, 0] }}
                transition={{ duration: a.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                style={{ transformOrigin: `${a.cx}px ${a.cy}px` }}
              >
                <polygon
                  points={`${a.cx - 8 * a.s},${a.cy} ${a.cx - 3 * a.s},${a.cy - 7 * a.s} ${a.cx + 6 * a.s},${a.cy - 5 * a.s} ${a.cx + 8 * a.s},${a.cy + 3 * a.s} ${a.cx},${a.cy + 8 * a.s}`}
                  stroke="var(--sub)"
                  strokeWidth="1.1"
                  opacity={0.55}
                />
              </motion.g>
            ))}
          </motion.g>

          {/* -------- near layer: astronaut, radar, tether -------- */}
          <motion.g style={{ x: nearX, y: nearY }}>
            <motion.g
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* radar rings */}
              <motion.circle
                cx="210"
                cy="170"
                r="58"
                stroke="var(--accent)"
                strokeWidth="1"
                opacity={0.22}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
              />
              <motion.circle
                cx="210"
                cy="170"
                r="84"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="2 5"
                opacity={0.15}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.65 }}
              />
              <motion.line
                x1="210"
                y1="170"
                x2="210"
                y2="112"
                stroke="var(--accent)"
                strokeWidth="1.4"
                opacity={0.5}
                style={{ transformOrigin: "210px 170px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* snapped tether, frayed end with sparks */}
              <motion.path
                d="M 176 178 C 140 170, 110 190, 90 172"
                stroke="var(--sub)"
                strokeWidth="1.3"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 }}
              />
              <motion.circle
                cx="90"
                cy="172"
                r="2"
                fill="var(--accent)"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* astronaut */}
              <g transform="translate(210 170)">
                {/* backpack */}
                <rect x="-19" y="-14" width="16" height="34" rx="5" stroke="var(--sub)" strokeWidth="1.4" opacity={0.7} />
                {/* legs */}
                <path d="M -8 20 C -14 32, -12 40, -18 46" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 8 20 C 13 33, 10 40, 15 47" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
                {/* torso */}
                <rect x="-15" y="-16" width="30" height="38" rx="13" stroke="var(--ink)" strokeWidth="2" />
                {/* arms */}
                <path d="M -14 -4 C -26 -2, -30 10, -24 20" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 14 -4 C 24 2, 22 16, 12 22" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
                {/* helmet */}
                <motion.circle
                  cx="0"
                  cy="-34"
                  r="17"
                  stroke="var(--ink)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
                <circle cx="-2" cy="-35" r="10" stroke="var(--accent)" strokeWidth="1.4" opacity={0.8} />
                <path d="M -8 -41 C -4 -44, 2 -44, 6 -41" stroke="var(--bg)" strokeWidth="2" opacity={0.9} />
              </g>

              {/* confused "?" bubble */}
              <motion.g
                animate={{ y: [0, -5, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx="252" cy="122" r="12" stroke="var(--accent)" strokeWidth="1.4" opacity={0.7} />
                <text
                  x="252"
                  y="127"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight={700}
                  fill="var(--accent)"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ?
                </text>
              </motion.g>
            </motion.g>
          </motion.g>
        </svg>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* COPY                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 select-none text-[6rem] font-bold leading-none text-[var(--accent)] opacity-25 mix-blend-multiply dark:mix-blend-screen sm:text-[8rem] md:text-[10rem]"
            style={{ fontFamily: "var(--font-display)" }}
            animate={{ x: [-4, -6, -3, -4], y: [4, 5, 3, 4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.div>
          <motion.div
            className="absolute inset-0 select-none text-[6rem] font-bold leading-none text-[var(--sub)] opacity-20 mix-blend-multiply dark:mix-blend-screen sm:text-[8rem] md:text-[10rem]"
            style={{ fontFamily: "var(--font-display)" }}
            animate={{ x: [4, 6, 3, 4], y: [-4, -5, -3, -4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.div>
          <h1
            className="relative select-none text-[6rem] font-bold leading-none tracking-tighter text-[var(--ink)] sm:text-[8rem] md:text-[10rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 flex flex-col items-center gap-8"
        >
          <div className="space-y-3">
            <h2
              className="text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lost in space.
            </h2>
            <p className="mx-auto max-w-md text-lg text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              The page you're looking for drifted off somewhere. Tether's snapped — let's get you back to solid
              ground.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--ink)] px-8 font-medium text-[var(--bg)] transition-transform hover:scale-105 active:scale-95"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="absolute inset-0 h-full w-full translate-y-full bg-white/20 transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
              <ArrowLeft size={20} className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="relative z-10">Return to Homepage</span>
            </Link>

            <button
              onClick={() => router.back()}
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-[var(--line)] px-7 font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <RotateCcw size={17} className="transition-transform duration-500 group-hover:-rotate-180" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}