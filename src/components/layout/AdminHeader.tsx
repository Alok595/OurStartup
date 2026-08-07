"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AdminHeader() {
  const pathname = usePathname();
  
  // Create a simple breadcrumb from the pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentPage = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--bg)]/80 px-6 backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 rounded-lg text-[var(--ink)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]">
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          {currentPage}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="h-6 w-px bg-[var(--line)]"></div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium text-[var(--sub)] hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
