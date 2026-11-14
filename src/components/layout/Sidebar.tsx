"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  Settings,
  ChevronRight,
  Star,
  Users,
  UserCheck
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: MessageSquare },
  { label: "Interested Clients", href: "/interested-clients", icon: UserCheck },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Projects", href: "/portfolio", icon: Briefcase },
  { label: "Stories", href: "/stories", icon: Star },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center px-6 border-b border-[var(--line)]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo-modified.png" alt="GenZDevWorks Logo" width={112} height={112} className="w-8 h-8 shrink-0 transition-transform duration-300 hover:scale-[3.5] hover:z-50 relative origin-top-left" />
          <span
            className="text-lg font-bold tracking-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            GenZDev<span style={{ color: "var(--accent)" }}>Works</span> Admin
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--ink)]"
                    : "text-[var(--sub)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-[var(--ink)]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-[var(--line)]/50 border border-[var(--line)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
                
                {isActive && (
                  <ChevronRight size={14} className="relative z-10 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-[var(--line)]">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 text-center">
          <div className="mx-auto h-8 w-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-2">
            <span className="text-[var(--accent)] font-bold text-xs" style={{ fontFamily: "var(--font-mono)" }}>PRO</span>
          </div>
          <p className="text-xs font-medium text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>Admin Access</p>
          <p className="text-[10px] text-[var(--sub)] mt-1" style={{ fontFamily: "var(--font-mono)" }}>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
