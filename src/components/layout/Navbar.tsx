"use client";

/**
 * Navbar.tsx
 * ----------------------------------------------------------------------------
 * Companion navbar for HeroSection — same design language: Space Grotesk
 * wordmark, the --bg/--ink/--sub/--line/--accent CSS-variable token system,
 * and Framer Motion micro-interactions.
 *
 * TOKENS — HeroSection defines --bg/--ink/--sub/--line/--accent locally on
 * its own <section>. The navbar sits outside that scope (it's fixed at the
 * page root), so it needs the same tokens available globally. Add this once
 * to app/globals.css so every component can share them:
 *
 *   :root {
 *     --bg: #F5F3EC;
 *     --ink: #14171F;
 *     --sub: #5B5F6B;
 *     --line: #D9D4C8;
 *     --accent: #D9600A;
 *   }
 *   .dark {
 *     --bg: #0A0C10;
 *     --ink: #EDEAE2;
 *     --sub: #8892A6;
 *     --line: #242A35;
 *     --accent: #FF8A3D;
 *   }
 *
 * (HeroSection can keep overriding --accent per-slide locally — a nested
 * CSS variable always wins over the one inherited from :root/.dark.)
 * ----------------------------------------------------------------------------
 */

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const links = [
  { href: "/projects", label: "Projects" },

  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if Navbar should be hidden on auth and admin routes
  const hideRoutes = ['/login', '/dashboard', '/leads', '/portfolio', '/settings', '/stories', '/clients', '/interested-clients'];
  const isHidden = hideRoutes.some(route => pathname?.startsWith(route));

  // --- Scroll Detection ---
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isHidden) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4" style={{ fontFamily: "var(--font-body)" }}>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-3xl rounded-full border border-[var(--line)] bg-[var(--bg)]/70 px-5 py-2.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            : "max-w-7xl rounded-full border border-transparent bg-transparent px-4 py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* logomark + wordmark */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo-modified.png" alt="GenZDevWorks Logo" width={112} height={112} className="w-8 h-8 shrink-0 transition-transform duration-300 hover:scale-[3.5] hover:z-50 relative origin-top-left" />
            <span
              className="text-xl font-bold tracking-tight text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GenZDev<span style={{ color: "var(--accent)" }}>Works</span>
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative px-3.5 py-2 text-[13.5px] font-medium text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
              >
                {l.label}
                <span className="pointer-events-none absolute inset-x-3.5 -bottom-0 h-px origin-center scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link href="/login" aria-label="Admin Login" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              <User size={16} />
            </Link>

            <Link href="/contact" prefetch={true} className="hidden md:inline-flex">
              <MagneticButton className="items-center rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white dark:text-[#0A0C10]" style={{ backgroundColor: "var(--accent)" }}>
                Let&apos;s Talk
              </MagneticButton>
            </Link>

            {/* mobile menu trigger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] md:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <motion.span
                  className="absolute left-0 top-0 h-[1.5px] w-full bg-current"
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current"
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-3 right-3 top-[calc(100%+0.4rem)] z-40 rounded-2xl border border-[var(--line)] bg-[var(--bg)]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--line)]/30"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="mt-2 block w-full rounded-full px-5 py-3 text-center text-[14px] font-semibold text-white dark:text-[#0A0C10] transition-transform active:scale-[0.98]"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Let&apos;s Talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------------------------------------------------------------------------
// MAGNETIC BUTTON — small pointer-follow effect, matches the one used for
// the hero's CTAs. If you already extracted one from HeroSection, delete
// this copy and import that shared component instead.
// ---------------------------------------------------------------------------
function MagneticButton({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
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
    <motion.button onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ ...style, x: sx, y: sy }}>
      {children}
    </motion.button>
  );
}