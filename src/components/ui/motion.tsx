"use client";

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

const ADMIN_ROUTES = ["/login", "/dashboard", "/leads", "/portfolio", "/settings", "/stories", "/clients", "/interested-clients"];
export const isAdminRoute = (path?: string | null) => !!path && ADMIN_ROUTES.some((r) => path.startsWith(r));

/** Fade + lift on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Headline that rises word by word out of a clipping mask.
 *  The in-view trigger lives on the outer span — the words themselves start
 *  clipped by their masks, so an observer on them would never fire. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  onMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  onMount?: boolean;
}) {
  const words = text.split(" ");
  const trigger = onMount
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, margin: "-40px" } };
  return (
    <motion.span className={className} aria-label={text} initial="hidden" {...trigger}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.8, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Counts a number up when it scrolls into view. Keeps any prefix/suffix. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    const [, pre, num, post] = match;
    const target = parseFloat(num);
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${pre}${v.toFixed(decimals)}${post}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/** CSS-driven infinite marquee — no JS per frame. */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${reverse ? "marquee--reverse" : ""} ${className}`} style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}>
      <div className="marquee__track">{children}</div>
      <div className="marquee__track" aria-hidden>
        {children}
      </div>
    </div>
  );
}

/** Element that leans toward the pointer. */
export function Magnetic({ children, strength = 0.25, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.2 });
  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Small arrow glyph used across links. */
export function Arrow({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" className={className} aria-hidden>
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

/** Four-point sparkle — the brand's punctuation mark. */
export function Spark({ size = 24, className, color = "currentColor" }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0c.8 6.4 4.8 10.6 12 12-7.2 1.4-11.2 5.6-12 12-.8-6.4-4.8-10.6-12-12C7.2 10.6 11.2 6.4 12 0Z" fill={color} />
    </svg>
  );
}
