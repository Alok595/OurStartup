"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/BrandIcons";
import { Arrow, EASE, Magnetic, Marquee, Spark, isAdminRoute } from "@/components/ui/motion";

const SITEMAP = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const WORDMARK = "GENZDEVWORKS".split("");

export default function Footer() {
  const pathname = usePathname();
  if (isAdminRoute(pathname)) return null;

  return (
    <footer className="panel-cobalt halftone relative overflow-hidden border-t-2 border-[var(--edge)]">
      {/* Running headline */}
      <div className="border-b border-white/15 py-4 sm:py-6">
        <Marquee speed={38}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8">
              <span className="f-display whitespace-nowrap text-[13vw] sm:text-[7vw]">Let&apos;s talk</span>
              <Spark size={56} color="#FFD23F" className="spin-slow shrink-0" />
              <span
                className="f-display whitespace-nowrap text-[13vw] text-transparent sm:text-[7vw]"
                style={{ WebkitTextStroke: "2px #F3EFE6" }}
              >
                Build loud
              </span>
              <Spark size={56} color="#34D399" className="spin-slow shrink-0" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label text-[var(--yolk)]">Got an idea?</p>
            <h2 className="f-display mt-5 text-5xl sm:text-6xl lg:text-7xl">
              Bring it.
              <br />
              <span className="f-serif text-[1.08em] font-normal tracking-normal text-[var(--mint)]">we&apos;ll make it real.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Two-minute brief, one real human on the other end, and a reply within 24 hours.
            </p>
            <Magnetic className="mt-9 inline-block">
              <Link href="/contact" className="btn btn-yolk !px-7 !py-5 !text-[13px]">
                Start a project <Arrow size={15} />
              </Link>
            </Magnetic>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <p className="label text-white/50">Sitemap</p>
              <ul className="mt-5 flex flex-col gap-3">
                {SITEMAP.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-wipe text-lg font-semibold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label text-white/50">Say hi</p>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                <li>
                  <a href="mailto:genzdevworks@gmail.com" className="link-wipe break-all font-semibold">
                    genzdevworks@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+916202585952" className="link-wipe font-semibold">
                    +91 6202 585 952
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/916202585952" target="_blank" rel="noopener noreferrer" className="link-wipe font-semibold">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="label text-white/50">Follow</p>
              <div className="mt-5 flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-12 w-12 place-items-center border-2 border-white/80 transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--bubblegum)] hover:shadow-[4px_4px_0_#0E0E10]"
                >
                  <InstagramIcon width={20} height={20} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="grid h-12 w-12 place-items-center border-2 border-white/80 transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--sky)] hover:shadow-[4px_4px_0_#0E0E10]"
                >
                  <LinkedinIcon width={20} height={20} />
                </a>
              </div>
              <p className="mt-6 text-sm text-white/60">Remote-first. Shipping worldwide from India.</p>
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-12 select-none overflow-hidden" aria-hidden>
          <div className="flex w-full items-center justify-between">
            {WORDMARK.map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.035, ease: EASE }}
                className="f-display inline-block text-[6.6vw] sm:text-[6.9vw] md:text-[7.1vw] lg:text-[7.3vw] leading-[0.85] text-[#F3EFE6] transition-colors duration-200 hover:text-[var(--yolk)] 2xl:text-[100px]"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/20 py-6 text-[13px] text-white/60 sm:flex-row sm:items-center">
          <p className="f-mono">© {new Date().getFullYear()} GenZDevWorks — built by hand, not by template.</p>
          <div className="f-mono flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
