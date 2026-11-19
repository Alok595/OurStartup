"use client";

import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Arrow, EASE, isAdminRoute } from "@/components/ui/motion";

const links = [
  { href: "/projects", label: "Work", n: "01" },
  { href: "/services", label: "Services", n: "02" },
  { href: "/about", label: "About", n: "03" },
  { href: "/contact", label: "Contact", n: "04" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // the catalog has its own sticky toolbar tucked under the nav, so keep the nav pinned there
    setHidden(pathname !== "/projects" && y > 240 && y > prev);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isAdminRoute(pathname)) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color] duration-300 ${
          scrolled || open ? "border-b-2 border-[var(--edge)] bg-[var(--paper)]" : "border-b-2 border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-8">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <Image src="/images/logo-modified.png" alt="GenZDevWorks Logo" width={112} height={112} priority className="w-8 h-8 shrink-0 transition-transform duration-300 hover:scale-[3.5] hover:z-50 relative origin-top-left" />
            <span
              className="text-xl font-bold tracking-tight text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GenZDev<span style={{ color: "var(--accent)" }}>Works</span>
            </span>
          </Link>

          <ul className="hidden items-stretch md:flex">
            {links.map((l) => {
              const active = pathname?.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`group relative flex h-10 items-center gap-2 overflow-hidden px-4 text-[14px] font-semibold transition-colors ${
                      active ? "text-[#0E0E10]" : "text-[var(--ink)]"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 origin-bottom bg-[var(--yolk)] transition-transform duration-300 ease-[var(--ease-out)] ${
                        active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    <span className="label relative !text-[10px] opacity-60">{l.n}</span>
                    <span className="relative group-hover:text-[#0E0E10]">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              aria-label="Admin login"
              className="hidden h-10 w-10 place-items-center border-2 border-[var(--edge)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)] sm:grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square">
                <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            </Link>
            <Link href="/contact" className="btn btn-yolk hidden !py-3 lg:inline-flex">
              Start a project <Arrow size={14} />
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center border-2 border-[var(--edge)] bg-[var(--ink)] text-[var(--bg)] md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-300 ${open ? "bottom-1/2 w-full translate-y-1/2 -rotate-45" : "w-2/3"}`} />
              </span>
            </button>
          </div>
        </nav>

        <motion.div aria-hidden style={{ scaleX: progress }} className="absolute -bottom-[2px] left-0 h-[3px] w-full origin-left bg-[var(--accent)]" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
            className="panel-cobalt halftone fixed inset-0 z-[65] flex flex-col justify-between px-5 pb-8 pt-24 md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: EASE }}
                  className="border-b border-white/20"
                >
                  <Link href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4">
                    <span className="f-display text-[13vw] leading-[0.95]">{l.label}</span>
                    <span className="label opacity-60">{l.n}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4"
            >
              <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-yolk w-full">
                Start a project <Arrow size={14} />
              </Link>
              <div className="flex justify-between text-sm text-white/70">
                <a href="mailto:genzdevworks@gmail.com">genzdevworks@gmail.com</a>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
