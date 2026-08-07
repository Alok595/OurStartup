"use client";

import Link from "next/link";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { usePathname } from "next/navigation";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on auth and admin routes
  const hideRoutes = ['/login', '/dashboard', '/leads', '/portfolio', '/settings', '/stories'];
  if (hideRoutes.some(route => pathname?.startsWith(route))) {
    return null;
  }

  return (
    <footer className={`${display.variable} ${body.variable} ${mono.variable} border-t border-[var(--line)] bg-[var(--bg)] pt-20 pb-10 sm:pt-28 sm:pb-12 px-6 sm:px-10`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-16">
        
        {/* Top Section: CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              Let's build<br />something great.
            </h2>
            <p className="text-xl text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              Ready to transform your idea into reality? We partner with ambitious teams to engineer products that scale.
            </p>
          </div>
          <div>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-4 text-sm font-semibold tracking-[0.1em] text-white transition-transform hover:scale-105 uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Start a project
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-[var(--line)]"></div>

        {/* Bottom Section: Links & Legal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="text-2xl font-bold tracking-tight text-[var(--ink)] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              StartupOur
            </div>
            <p className="text-sm text-[var(--sub)] max-w-sm" style={{ fontFamily: "var(--font-body)" }}>
              A technology-driven software development agency for forward-thinking enterprises.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Company</h4>
            <Link href="#about" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>About Us</Link>
            <Link href="/services" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>Services</Link>
            <Link href="/projects" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>Projects</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Connect</h4>
            <a href="#" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>Twitter / X</a>
            <a href="#" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>LinkedIn</a>
            <a href="#" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-body)" }}>GitHub</a>
          </div>

        </div>

        {/* Very Bottom: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-xs text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
          <p>© {new Date().getFullYear()} StartupOur Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
