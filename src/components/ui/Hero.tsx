"use client";

/**
 * HeroSection.tsx
 * ----------------------------------------------------------------------------
 * Full-viewport "service scene" hero for a software development agency.
 * Each slide is a full-bleed animated SVG scene with the copy overlaid on
 * top — a real slideshow, not a boxed card.
 *
 * Stack: Next.js (App Router) · Tailwind CSS · Framer Motion · GSAP
 *
 * SETUP
 * 1) npm install framer-motion gsap
 * 2) Fonts: next/font/google (Space Grotesk, Inter, JetBrains Mono). Delete
 *    the font block if you already load fonts globally.
 * 3) Drop <HeroSection /> at the top of app/page.tsx.
 * 4) Dark mode: this component is class-based (`dark` on <html>), which is
 *    what next-themes and Tailwind's `darkMode: "class"` use. If your app
 *    doesn't have a theme switcher yet, this file ships a small built-in
 *    <ThemeToggle /> (top-right) so you can see both modes immediately —
 *    delete it and wire up next-themes once you have real theme state.
 *
 * LIGHT / DARK
 * All neutral colors live in four CSS custom properties set once on the
 * outer <section> and flipped with Tailwind's `dark:` variant:
 *   --bg, --ink (headline text), --sub (body text), --line (hairlines)
 * The per-slide accent is two hexes (accentLight / accentDark) resolved the
 * same way into a single --accent variable, so every SVG stroke/fill and
 * every accent-colored bit of UI just reads var(--accent) and never needs
 * to know which theme is active.
 *
 * RESPONSIVE LAYOUT
 * Below the `sm` breakpoint the hero switches from an absolutely-positioned
 * cinematic overlay (text floating over a full-bleed scene, held to
 * 100svh) to a normal stacked flex flow: illustration on top in its own
 * fixed-height band, copy below it, controls last — and the section is
 * allowed to grow past 100svh instead of clipping content. This is what
 * makes the SVG scene actually visible on phones/tablets: the scrim
 * gradients that fade the scene into the text zone only apply at `sm:`
 * and up, and the illustration gets its own un-scrimmed viewport.
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

gsap.registerPlugin(MotionPathPlugin);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// ---------------------------------------------------------------------------
// SERVICE DATA — accentLight is tuned for contrast on a cream background,
// accentDark for a near-black one. Same hue family, different weight.
// ---------------------------------------------------------------------------
type Service = {
  id: string;
  tag: string;
  title: string;
  description: string;
  accentLight: string;
  accentDark: string;
  Svg: React.FC<{ accent: string }>;
};

const services: Service[] = [
  {
    id: "web",
    tag: "Web Development",
    title: "Websites built to convert, not just load.",
    description:
      "Marketing sites, dashboards and web apps engineered for speed, SEO and clean handoffs — from first pixel to production.",
    accentLight: "#D9600A",
    accentDark: "#FF8A3D",
    Svg: WebSvg,
  },
  {
    id: "mobile",
    tag: "Mobile Applications",
    title: "Native-feel apps, shipped on both stores.",
    description:
      "iOS and Android products with fluid UI, offline support and analytics baked in from day one — not bolted on after launch.",
    accentLight: "#5B45CF",
    accentDark: "#9C8CFF",
    Svg: MobileSvg,
  },
  {
    id: "ai",
    tag: "AI-Powered Solutions",
    title: "AI that works quietly inside your product.",
    description:
      "Copilots, retrieval pipelines and model integrations designed around real workflows, with guardrails your team can trust.",
    accentLight: "#0C9C89",
    accentDark: "#4FE8D0",
    Svg: AiSvg,
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Fewer manual steps, more shipped work.",
    description:
      "We map your busywork and replace it with resilient pipelines — internal tools, integrations and workflows that just run.",
    accentLight: "#0C9C89",
    accentDark: "#4FE8D0",
    Svg: AutomationSvg,
  },
  {
    id: "branding",
    tag: "Branding",
    title: "A visual identity that earns trust fast.",
    description:
      "Logo systems, design tokens and brand guidelines that stay consistent from the pitch deck to the product itself.",
    accentLight: "#5B45CF",
    accentDark: "#9C8CFF",
    Svg: BrandingSvg,
  },
  {
    id: "custom",
    tag: "Custom Software",
    title: "Software shaped around how you work.",
    description:
      "When off-the-shelf stops fitting, we design and build bespoke systems that scale with your team, not against it.",
    accentLight: "#D9600A",
    accentDark: "#FF8A3D",
    Svg: CustomSvg,
  },
];

const SLIDE_DURATION = 5200; // ms

export default function HeroSection() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const current = services[active];

  const goTo = useCallback((i: number) => setActive(((i % services.length) + services.length) % services.length), []);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [active, paused, next]);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: paused ? 9999 : SLIDE_DURATION / 1000, ease: "none", transformOrigin: "left center" }
    );
  }, [active, paused]);

  // subtle mouse parallax on the illustration only (desktop pointer only —
  // touch devices never fire mousemove, so this is a no-op on mobile)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { damping: 20, stiffness: 120 });
  const sy = useSpring(py, { damping: 20, stiffness: 120 });
  const onMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - left) / width - 0.5) * 24);
    py.set(((e.clientY - top) / height - 0.5) * 24);
  };
  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
    setPaused(false);
  };

  const words = current.title.split(" ");

  return (
    <section
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${display.variable} ${body.variable} ${mono.variable} relative flex min-h-[100svh] w-full flex-col overflow-x-clip
        sm:block sm:h-[100svh] sm:min-h-[700px] sm:overflow-hidden
        [--bg:#F5F3EC] dark:[--bg:#0A0C10]
        [--ink:#14171F] dark:[--ink:#EDEAE2]
        [--sub:#5B5F6B] dark:[--sub:#8892A6]
        [--line:#D9D4C8] dark:[--line:#242A35]
        [--accent:var(--accent-light)] dark:[--accent:var(--accent-dark)]
        bg-[var(--bg)] text-[var(--ink)] transition-colors duration-500`}
      style={
        {
          "--accent-light": current.accentLight,
          "--accent-dark": current.accentDark,
        } as React.CSSProperties
      }
    >
      {/* faint background grid texture, full screen */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:64px_64px]" />

      {/* ambient accent glow behind the scene — smaller/repositioned on phones
          so it sits behind the illustration band instead of the whole page */}
      <div
        className="pointer-events-none absolute right-[-30%] top-[6%] h-[340px] w-[340px] rounded-full blur-[90px] transition-colors duration-700
          sm:right-[-8%] sm:top-1/2 sm:h-[680px] sm:w-[680px] sm:-translate-y-1/2 sm:blur-[160px]"
        style={{ backgroundColor: "var(--accent)", opacity: 0.22 }}
      />

      {/* full-bleed SVG scene. Mobile: its own bottom band in normal flow. 
          sm+: original absolute full-bleed panel, right-anchored. */}
      <div
        className="relative order-3 h-[55vh] min-h-[360px] w-full shrink-0 overflow-hidden rounded-t-2xl border-t border-[var(--line)] bg-[var(--bg)]
          sm:absolute sm:inset-y-0 sm:right-0 sm:order-none sm:h-full sm:min-h-0 sm:w-[72%] sm:rounded-none sm:border-0 sm:bg-transparent lg:w-[60%]"
      >
        <motion.div style={{ x: sx, y: sy }} className="h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              <SvgStage Svg={current.Svg} slideKey={current.id} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* mobile-only soft fade so the illustration blends into the bottom */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_100%)] sm:hidden" />
      </div>

      {/* scrims for legibility — desktop/tablet cinema treatment only.
          On mobile the illustration has its own band above, so no scrim
          is needed (or wanted) over the page. */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[linear-gradient(100deg,var(--bg)_0%,var(--bg)_34%,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[linear-gradient(to_top,var(--bg)_0%,transparent_16%,transparent_84%,var(--bg)_100%)] opacity-95" />

      {/* copy */}
      <div
        className="relative z-10 order-1 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-6 pt-28
          sm:h-full sm:flex-none sm:px-10 sm:pt-20 sm:pb-40 lg:pb-48"
      >
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)]/50 px-3 py-1.5 text-[10px] tracking-[0.16em] text-[var(--sub)] backdrop-blur-sm sm:mb-7 sm:text-[11px] sm:tracking-[0.18em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            SOFTWARE PARTNER · IDEA TO PRODUCTION
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial="hidden" animate="show" exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}>
              <p
                className="mb-3 text-[12px] tracking-[0.14em] sm:text-[13px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
              >
                {current.tag.toUpperCase()}
              </p>

              <h1
                className="text-[1.9rem] leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {words.map((w, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" }}
                    className="mr-[0.28em] inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 max-w-md text-[14px] leading-relaxed text-[var(--sub)] sm:mt-6 sm:text-[15px] lg:text-base"
              >
                {current.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
          >
            <Link href="/contact" prefetch={true}>
              <MagneticButton
                className="rounded-full px-6 py-3 text-sm font-medium text-white dark:text-[#0A0C10]"
                style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-body)" }}
              >
                Start a project
              </MagneticButton>
            </Link>
            <Link 
              href="/projects"
              prefetch={true}
              className="inline-flex rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--sub)]"
            >
              See our work
            </Link>
          </motion.div>
        </div>
      </div>

      {/* bottom control bar — in normal flow on mobile (so it never gets
          clipped or overlaps the copy above it), pinned to the bottom of
          the cinematic panel from sm: up, as in the original design. */}
      <div className="relative z-10 order-2 px-6 pb-8 pt-2 sm:absolute sm:inset-x-0 sm:bottom-0 sm:px-10 sm:pb-10 sm:pt-0">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4"
        >
          <div className="text-[10px] font-semibold tracking-[0.2em] text-[var(--sub)] uppercase sm:text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>
            What we offer
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="rounded-full border px-4 py-2 text-[12px] transition-colors sm:text-[12.5px]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    borderColor: isActive ? "var(--accent)" : "var(--line)",
                    color: isActive ? "white" : "var(--sub)",
                    backgroundColor: isActive ? "var(--accent)" : "transparent",
                  }}
                >
                  {s.tag}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--line)]">
              <div ref={progressRef} className="h-full w-full origin-left" style={{ backgroundColor: "var(--accent)" }} />
            </div>
            <span className="shrink-0 text-[11px] tracking-[0.15em] text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
              0{active + 1} / 0{services.length}
            </span>
            <div className="flex shrink-0 gap-2">
              <button
                aria-label="Previous service"
                onClick={() => goTo(active - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--sub)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
              >
                <ArrowIcon flip />
              </button>
              <button
                aria-label="Next service"
                onClick={next}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--sub)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: flip ? "rotate(180deg)" : undefined }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// THEME TOGGLE — demo-only helper so both modes are visible without a real
// theme provider wired up yet. Toggles the `dark` class on <html>. If you
// already use next-themes (or similar), delete this and use your own toggle.
// ---------------------------------------------------------------------------
function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  if (dark === null) return null;

  return (
    <button
      onClick={() => {
        const next = !dark;
        document.documentElement.classList.toggle("dark", next);
        setDark(next);
      }}
      aria-label="Toggle theme"
      className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)]/60 text-[var(--ink)] backdrop-blur-sm transition-transform hover:scale-105 sm:right-6 sm:top-6 sm:h-10 sm:w-10"
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// MAGNETIC BUTTON
// ---------------------------------------------------------------------------
function MagneticButton({ children, className, style, onClick }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const sy = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * 0.2);
    y.set((e.clientY - (top + height / 2)) * 0.2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} className={className} style={{ ...style, x: sx, y: sy }}>
      {children}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// SVG STAGE — mounts the active scene and drives the animation system:
// draw-in, then infinite ambient loops (spin / flow / float / orbit)
// ---------------------------------------------------------------------------
function SvgStage({ Svg, slideKey }: { Svg: React.FC<{ accent: string }>; slideKey: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const root = wrapRef.current;

    const ctx = gsap.context(() => {
      const drawPaths = root.querySelectorAll<SVGGeometryElement>(".draw-path");
      const dots = root.querySelectorAll<SVGElement>(".pulse-dot");
      const spinners = root.querySelectorAll<SVGElement>(".spin-cw, .spin-ccw");
      const flows = root.querySelectorAll<SVGGeometryElement>(".flow-dash");
      const floaters = root.querySelectorAll<SVGElement>(".float");
      const cursors = root.querySelectorAll<SVGElement>(".blink-cursor");
      const orbiters = root.querySelectorAll<SVGElement>(".orbit-dot");

      drawPaths.forEach((p, i) => {
        let len = p.getTotalLength();
        if (p.tagName.toLowerCase() === "rect") {
          const w = parseFloat(p.getAttribute("width") || "0");
          const h = parseFloat(p.getAttribute("height") || "0");
          const rx = parseFloat(p.getAttribute("rx") || "0");
          len = 2 * w + 2 * h - 8 * rx + 2 * Math.PI * rx;
        } else if (p.tagName.toLowerCase() === "circle") {
          const r = parseFloat(p.getAttribute("r") || "0");
          len = 2 * Math.PI * r;
        }
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", delay: 0.025 * i });
      });
      const settleAt = 0.5 + drawPaths.length * 0.025;

      if (dots.length) {
        gsap.fromTo(dots, { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 0.5, delay: settleAt, stagger: 0.06, ease: "back.out(3)" });
        gsap.to(dots, { opacity: 0.45, duration: 1.1, delay: settleAt + 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.15 });
      }

      spinners.forEach((el) => {
        el.style.transformBox = "fill-box";
        el.style.transformOrigin = "center";
        const speed = parseFloat(el.getAttribute("data-speed") || "8");
        gsap.to(el, { rotation: el.classList.contains("spin-ccw") ? -360 : 360, duration: speed, repeat: -1, ease: "none", delay: settleAt });
      });

      flows.forEach((el, i) => {
        const dash = el.getAttribute("data-dash") || "5 5";
        el.setAttribute("stroke-dasharray", dash);
        gsap.fromTo(el, { strokeDashoffset: 0 }, { strokeDashoffset: -40, duration: 1.4, repeat: -1, ease: "none", delay: settleAt + i * 0.1 });
      });

      floaters.forEach((el, i) => {
        gsap.to(el, { y: "+=5", duration: 1.7 + (i % 3) * 0.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: settleAt + i * 0.12 });
      });

      cursors.forEach((el, i) => {
        gsap.to(el, { opacity: 0, duration: 0.55, repeat: -1, yoyo: true, ease: "steps(1)", delay: settleAt + 0.4 + i * 0.1 });
      });

      orbiters.forEach((el, i) => {
        const ref = el.getAttribute("data-orbit");
        if (!ref) return;
        gsap.set(el, { opacity: 0 });
        gsap.to(el, {
          opacity: 1,
          duration: 0.3,
          delay: settleAt + i * 0.2,
          onComplete: () => {
            gsap.to(el, { motionPath: { path: ref, align: ref, alignOrigin: [0.5, 0.5] }, duration: 2.2 + i * 0.4, repeat: -1, ease: "power1.inOut" });
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [slideKey]);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Svg accent="var(--accent)" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SERVICE ILLUSTRATIONS — each is a full-scene svg (viewBox 0 0 300 200,
// scaled up by the container) using var(--line)/var(--sub)/var(--ink) for
// neutrals so they read correctly in both themes, and the accent prop
// (always "var(--accent)") for the service color.
// ---------------------------------------------------------------------------

function WebSvg({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <rect x="20" y="20" width="260" height="160" rx="10" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <line x1="20" y1="52" x2="280" y2="52" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="35" cy="36" r="3" fill="var(--line)" />
      <circle cx="47" cy="36" r="3" fill="var(--line)" />
      <circle cx="59" cy="36" r="3" fill="var(--line)" />
      <rect x="90" y="30" width="150" height="14" rx="7" className="draw-path" stroke="var(--line)" strokeWidth="1.3" />
      <circle cx="99" cy="37" r="2.2" fill="var(--sub)" />

      <rect x="40" y="70" width="90" height="88" rx="6" className="draw-path" stroke={accent} strokeWidth="2" />
      <path d="M46 142 L70 112 L86 130 L100 106 L124 142 Z" className="draw-path" stroke="var(--sub)" strokeWidth="1.3" strokeLinejoin="round" />
      <circle className="pulse-dot" cx="112" cy="90" r="6" fill={accent} />

      <path d="M150 74 H252" className="draw-path" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 90 H244" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M150 102 H228" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M150 114 H236" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" strokeLinecap="round" />

      <rect x="150" y="132" width="86" height="26" rx="13" className="draw-path" stroke={accent} strokeWidth="2" />
      <path d="M185 145 H208 M201 139 L208 145 L201 151" className="draw-path" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      <path className="float" d="M246 148 L246 168 L251 163 L255 172 L258 170 L254 161 L261 161 Z" fill="var(--ink)" stroke="var(--bg)" strokeWidth="1" />

      <line x1="272" y1="60" x2="272" y2="172" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
      <line className="float" x1="272" y1="66" x2="272" y2="98" stroke="var(--sub)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MobileSvg({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <rect x="100" y="10" width="100" height="180" rx="18" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <line x1="128" y1="23" x2="172" y2="23" className="draw-path" stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M112 34 h4 M120 34 h4 M128 34 h4" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M180 33 h8 M180 36 h5" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" strokeLinecap="round" />

      <rect x="112" y="46" width="76" height="46" rx="8" className="draw-path" stroke={accent} strokeWidth="2" />
      <path d="M138 62 L138 76 L152 69 Z" className="draw-path" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" fill={accent} fillOpacity="0.15" />

      <rect x="112" y="98" width="34" height="34" rx="6" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" />
      <path d="M119 124 v-8 M126 124 v-14 M133 124 v-5 M140 124 v-18" className="draw-path" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <rect x="154" y="98" width="34" height="34" rx="6" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" />
      <circle cx="171" cy="115" r="10" className="draw-path" stroke={accent} strokeWidth="2" />
      <path d="M171 115 L171 107 A8 8 0 0 1 178 119 Z" fill={accent} fillOpacity="0.5" />

      <rect x="112" y="140" width="76" height="16" rx="8" className="draw-path" stroke="var(--sub)" strokeWidth="1.3" />
      <circle className="pulse-dot" cx="122" cy="148" r="3.5" fill={accent} />

      <line x1="112" y1="172" x2="188" y2="172" className="draw-path" stroke="var(--line)" strokeWidth="1.3" />
      <circle className="pulse-dot" cx="126" cy="180" r="3" fill="var(--ink)" />
      <circle className="pulse-dot" cx="150" cy="180" r="3" fill={accent} />
      <circle className="pulse-dot" cx="174" cy="180" r="3" fill="var(--sub)" />

      <g className="float">
        <circle cx="222" cy="52" r="16" className="draw-path" stroke={accent} strokeWidth="1.8" />
        <path d="M216 48 a6 7 0 0 1 12 0 v4 l3 3 h-18 l3 -3 Z" className="draw-path" stroke={accent} strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="230" cy="46" r="3" fill={accent} />
      </g>
    </svg>
  );
}

function AiSvg({ accent }: { accent: string }) {
  const input: [number, number][] = [[46, 70], [46, 100], [46, 130]];
  const hidden: [number, number][] = [[130, 46], [130, 82], [130, 118], [130, 154]];
  const output: [number, number][] = [[214, 78], [214, 122]];

  const edges: [[number, number], [number, number]][] = [];
  input.forEach((a) => hidden.forEach((b) => edges.push([a, b])));
  hidden.forEach((a) => output.forEach((b) => edges.push([a, b])));

  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <defs>
        <path id="ai-orbit-1" d={`M ${input[0][0]} ${input[0][1]} L ${hidden[2][0]} ${hidden[2][1]}`} />
        <path id="ai-orbit-2" d={`M ${hidden[1][0]} ${hidden[1][1]} L ${output[1][0]} ${output[1][1]}`} />
      </defs>

      {edges.map(([[x1, y1], [x2, y2]], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="draw-path" stroke="var(--sub)" strokeWidth="1" opacity="0.45" />
      ))}

      <circle className="spin-ccw" data-speed="14" cx="172" cy="100" r="34" stroke={accent} strokeWidth="1.2" strokeDasharray="3 6" opacity="0.5" />

      {input.map(([x, y], i) => (
        <circle key={`i${i}`} className="pulse-dot" cx={x} cy={y} r="5" fill="var(--ink)" />
      ))}
      {hidden.map(([x, y], i) => (
        <circle key={`h${i}`} className="pulse-dot" cx={x} cy={y} r={i === 1 ? 8 : 5.5} fill={i === 1 ? accent : "var(--ink)"} />
      ))}
      {output.map(([x, y], i) => (
        <circle key={`o${i}`} className="pulse-dot" cx={x} cy={y} r="6" fill={accent} />
      ))}

      <circle className="orbit-dot" data-orbit="#ai-orbit-1" r="3" fill={accent} />
      <circle className="orbit-dot" data-orbit="#ai-orbit-2" r="3" fill="var(--ink)" />
    </svg>
  );
}

function AutomationSvg({ accent }: { accent: string }) {
  const bigTeeth = Array.from({ length: 8 }, (_, i) => (360 / 8) * i);
  const smallTeeth = Array.from({ length: 6 }, (_, i) => (360 / 6) * i);

  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <defs>
        <path id="auto-orbit" d="M 138 100 C 160 78, 178 78, 196 100" />
      </defs>

      <g className="spin-cw" data-speed="10">
        <circle cx="95" cy="100" r="36" className="draw-path" stroke={accent} strokeWidth="2" />
        <circle cx="95" cy="100" r="12" className="draw-path" stroke={accent} strokeWidth="2" />
        {bigTeeth.map((deg) => (
          <line key={deg} x1={95 + 36 * Math.cos((deg * Math.PI) / 180)} y1={100 + 36 * Math.sin((deg * Math.PI) / 180)} x2={95 + 46 * Math.cos((deg * Math.PI) / 180)} y2={100 + 46 * Math.sin((deg * Math.PI) / 180)} className="draw-path" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        ))}
      </g>

      <g className="spin-ccw" data-speed="6.5">
        <circle cx="150" cy="60" r="20" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" />
        <circle cx="150" cy="60" r="6" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" />
        {smallTeeth.map((deg) => (
          <line key={deg} x1={150 + 20 * Math.cos((deg * Math.PI) / 180)} y1={60 + 20 * Math.sin((deg * Math.PI) / 180)} x2={150 + 27 * Math.cos((deg * Math.PI) / 180)} y2={60 + 27 * Math.sin((deg * Math.PI) / 180)} className="draw-path" stroke="var(--sub)" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>

      <path d="M138 100 C 160 78, 178 78, 196 100" className="draw-path flow-dash" data-dash="4 6" stroke={accent} strokeWidth="1.6" />
      <circle className="orbit-dot" data-orbit="#auto-orbit" r="3.5" fill="var(--ink)" />

      <rect x="205" y="70" width="62" height="60" rx="8" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <path d="M216 85 l5 5 l9 -10" className="draw-path" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="235" y1="88" x2="258" y2="88" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M216 104 l5 5 l9 -10" className="draw-path" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="235" y1="107" x2="252" y2="107" className="draw-path" stroke="var(--sub)" strokeWidth="1.4" strokeLinecap="round" />
      <circle className="pulse-dot" cx="222" cy="120" r="3" fill={accent} />
      <line x1="235" y1="120" x2="258" y2="120" className="draw-path" stroke="var(--line)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BrandingSvg({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <path d="M60 40 V160 M96 40 V160 M132 40 V160 M60 60 H172 M60 100 H172 M60 140 H172" stroke="var(--line)" strokeWidth="1" opacity="0.5" />

      <circle cx="95" cy="90" r="38" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" />
      <circle cx="138" cy="100" r="38" className="draw-path" stroke={accent} strokeWidth="2.2" />
      <circle className="pulse-dot" cx="117" cy="95" r="4" fill="var(--ink)" />

      <g className="float">
        <path d="M215 55 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" className="draw-path" stroke={accent} strokeWidth="1.4" strokeLinejoin="round" />
      </g>
      <g className="float">
        <path d="M245 95 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" className="draw-path" stroke="var(--sub)" strokeWidth="1.2" strokeLinejoin="round" />
      </g>

      <path d="M232 130 L258 104 L266 112 L240 138 L228 142 Z" className="draw-path" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M228 142 L233 137" className="draw-path" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />

      {[
        { x: 60, fill: "none", stroke: "var(--sub)" },
        { x: 84, fill: accent, stroke: accent },
        { x: 108, fill: "none", stroke: "var(--sub)" },
        { x: 132, fill: "none", stroke: "var(--ink)" },
      ].map((s, i) => (
        <rect key={i} className="draw-path float" x={s.x} y="168" width="16" height="16" rx="4" fill={s.fill} fillOpacity={s.fill !== "none" ? 0.9 : 0} stroke={s.stroke} strokeWidth="1.4" />
      ))}
    </svg>
  );
}

function CustomSvg({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" fill="none" className="h-full w-full overflow-visible">
      <rect x="30" y="26" width="240" height="150" rx="10" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <line x1="30" y1="52" x2="270" y2="52" className="draw-path" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="46" cy="39" r="3" fill="var(--line)" />
      <circle cx="58" cy="39" r="3" fill="var(--line)" />
      <circle cx="70" cy="39" r="3" fill="var(--line)" />

      <path d="M78 76 L58 96 L78 116" className="draw-path" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 76 L130 96 L110 116" className="draw-path" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="98" y1="122" x2="90" y2="70" className="draw-path" stroke="var(--sub)" strokeWidth="2.4" strokeLinecap="round" />

      <path d="M148 68 H236" className="draw-path" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M158 82 H230" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M158 94 H210" className="draw-path" stroke="var(--sub)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M168 106 H222" className="draw-path" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      <path d="M148 118 H196" className="draw-path" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

      <rect className="blink-cursor" x="200" y="112" width="9" height="13" fill={accent} />

      <g className="spin-cw" data-speed="12" opacity="0.9">
        <circle cx="238" cy="148" r="13" className="draw-path" stroke="var(--sub)" strokeWidth="1.5" />
        <circle cx="238" cy="148" r="4" className="draw-path" stroke="var(--sub)" strokeWidth="1.5" />
        {Array.from({ length: 6 }, (_, i) => (60 / 6) * i * 6).map((deg) => (
          <line key={deg} x1={238 + 13 * Math.cos((deg * Math.PI) / 180)} y1={148 + 13 * Math.sin((deg * Math.PI) / 180)} x2={238 + 18 * Math.cos((deg * Math.PI) / 180)} y2={148 + 18 * Math.sin((deg * Math.PI) / 180)} className="draw-path" stroke="var(--sub)" strokeWidth="2.2" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}