"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/BrandIcons";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on auth and admin routes
  const hideRoutes = ['/login', '/dashboard', '/leads', '/portfolio', '/settings', '/stories', '/clients', '/interested-clients'];
  if (hideRoutes.some(route => pathname?.startsWith(route))) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] pt-20 pb-10 sm:pt-28 sm:pb-12 px-6 sm:px-10">
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
              <Image src="/images/logo-modified.png" alt="GenZDevWorks Logo" width={112} height={112} className="w-8 h-8 shrink-0 transition-transform duration-300 hover:scale-[3.5] hover:z-50 relative origin-bottom-left" />
              GenZDevWorks
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
            <div className="flex flex-wrap gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5">
                <InstagramIcon width={20} height={20} className="text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]" />
              </a>
              <a href="#" aria-label="LinkedIn" className="group flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5">
                <LinkedinIcon width={20} height={20} className="text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]" />
              </a>
            </div>
            
            <div className="mt-2 flex flex-col gap-3">
              <a href="mailto:genzdevworks@gmail.com" className="flex items-center gap-3 text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]" style={{ fontFamily: "var(--font-body)" }}>
                <Mail size={16} className="text-[var(--sub)]" />
                genzdevworks@gmail.com
              </a>
              <a href="tel:+916202585952" className="flex items-center gap-3 text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]" style={{ fontFamily: "var(--font-body)" }}>
                <Phone size={16} className="text-[var(--sub)]" />
                +91 6202 585 952
              </a>
            </div>
          </div>

        </div>

        {/* Very Bottom: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 text-xs text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
          <p>© {new Date().getFullYear()} GenZDevWorks Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
