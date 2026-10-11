"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Particle = {
  id: number;
  x: number;
  y: number;
  text: string;
  emoji: string;
  color: string;
  glowColor: string;
  angle: number;
  distance: number;
  rotation: number;
};

// High-impact anime / cyberpunk neon color palette
const ANIME_WORDS = [
  { text: "WEBSITE!", emoji: "🌐", color: "#FF007F", glowColor: "#FF55AA" }, // Sakura Neon Pink
  { text: "APPS!", emoji: "📱", color: "#00F5FF", glowColor: "#00BFFF" },    // Electric Cyan
  { text: "DM US!", emoji: "💬", color: "#39FF14", glowColor: "#00FF66" },   // Acid Lime Green
  { text: "UI / UX!", emoji: "✨", color: "#FFE600", glowColor: "#FFAA00" },  // Pikachu Gold
  { text: "LAUNCH!", emoji: "🚀", color: "#FF3D00", glowColor: "#FF6A00" },   // Solar Fire Orange
  { text: "LEVEL UP!", emoji: "⚡", color: "#BD00FF", glowColor: "#E040FB" }, // Neon Violet
  { text: "AI POWER!", emoji: "🤖", color: "#00FFA3", glowColor: "#00E5FF" }, // Cyber Mint
  { text: "CODE!", emoji: "💻", color: "#2979FF", glowColor: "#00E5FF" },     // Shonen Blue
  { text: "SHIP IT!", emoji: "🔥", color: "#FF1744", glowColor: "#FF5252" },  // Crimson Flame
  { text: "DESIGN!", emoji: "🎨", color: "#FF00D4", glowColor: "#FF80AB" },   // Cyber Magenta
  { text: "KAIZEN!", emoji: "📈", color: "#00E676", glowColor: "#69F0AE" },   // Neo Emerald
];

export default function ClickEffect() {
  const [particle, setParticle] = useState<Particle | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback((e: MouseEvent) => {
    // Only primary click (button 0 or undefined)
    if (e.button !== undefined && e.button !== 0) return;

    // Avoid spawning inside input/textarea fields
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
      return;
    }

    const item = ANIME_WORDS[Math.floor(Math.random() * ANIME_WORDS.length)];
    const id = Date.now() + Math.random();
    const angle = (Math.random() - 0.5) * 40;
    const distance = 70 + Math.random() * 30;
    const rotation = (Math.random() - 0.5) * 16;

    const newParticle: Particle = {
      id,
      x: e.clientX,
      y: e.clientY,
      text: item.text,
      emoji: item.emoji,
      color: item.color,
      glowColor: item.glowColor,
      angle,
      distance,
      rotation,
    };

    // Exactly one popup on screen per click
    if (timerRef.current) clearTimeout(timerRef.current);
    setParticle(newParticle);

    timerRef.current = setTimeout(() => {
      setParticle(null);
      timerRef.current = null;
    }, 1450);
  }, []);

  useEffect(() => {
    // Exactly one event listener so one click = strictly one popup
    window.addEventListener("click", handleClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleClick]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      <AnimatePresence>
        {particle && (
          <div
            key={particle.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: particle.x, top: particle.y }}
          >
            {/* Pure Anime Text & Emoji - Exactly One Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.35, y: 0, x: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
                scale: [0.35, 1.25, 1.05, 1.02, 0.9],
                y: [0, -particle.distance * 0.45, -particle.distance * 0.8, -particle.distance, -particle.distance - 12],
                x: [0, particle.angle * 0.5, particle.angle * 0.85, particle.angle, particle.angle * 1.05],
                rotate: particle.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.4,
                times: [0, 0.1, 0.72, 0.88, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap select-none font-black uppercase tracking-wider"
              style={{
                color: particle.color,
                textShadow: `
                  -1.5px -1.5px 0 #000000,
                   1.5px -1.5px 0 #000000,
                  -1.5px  1.5px 0 #000000,
                   1.5px  1.5px 0 #000000,
                   0px   2.5px 0 #000000,
                   0 0 12px ${particle.glowColor},
                   0 0 24px ${particle.color},
                   0 4px 10px rgba(0,0,0,0.85)
                `,
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
              }}
            >
              <span className="text-base sm:text-lg font-black tracking-widest italic drop-shadow">
                {particle.text}
              </span>
              <span className="text-xl sm:text-2xl scale-110 drop-shadow select-none">
                {particle.emoji}
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
