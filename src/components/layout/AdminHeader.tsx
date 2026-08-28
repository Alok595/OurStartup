"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, Database } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const pathname = usePathname();
  const [storage, setStorage] = useState<{ dataSize: number, storageSize: number, collections: number, objects: number } | null>(null);
  
  // Create a simple breadcrumb from the pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentPage = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : "Dashboard";

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await fetch("/api/system/storage");
        if (res.ok) {
          const data = await res.json();
          setStorage(data);
        }
      } catch (e) {
        console.error("Failed to fetch storage stats", e);
      }
    };
    fetchStorage();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const MAX_STORAGE_BYTES = 512 * 1024 * 1024; // 512 MB (Typical MongoDB Atlas Free Tier)
  const storagePercentage = storage ? Math.min(100, Math.round((storage.storageSize / MAX_STORAGE_BYTES) * 100)) : 0;

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
        {storage && (
          <div className="relative group hidden sm:block">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--sub)] bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1.5 rounded-full border border-[var(--line)] cursor-help">
              <Database size={14} className="text-[var(--accent)]" />
              <span>DB Storage: <span className="text-[var(--ink)]">{formatBytes(storage.storageSize)} / 512 MB</span></span>
            </div>
            
            {/* Tooltip Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="flex flex-col gap-3 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[var(--ink)] font-medium">Capacity Used</span>
                    <span className="font-semibold text-[var(--accent)]">{storagePercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${storagePercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="h-px bg-[var(--line)] my-0.5"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[var(--sub)]">Data Size:</span>
                  <span className="font-medium text-[var(--ink)]">{formatBytes(storage.dataSize)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--sub)]">Storage Size:</span>
                  <span className="font-medium text-[var(--ink)]">{formatBytes(storage.storageSize)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--sub)]">Collections:</span>
                  <span className="font-medium text-[var(--ink)]">{storage.collections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--sub)]">Documents:</span>
                  <span className="font-medium text-[var(--ink)]">{storage.objects}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ThemeToggle />
        
        <div className="h-6 w-px bg-[var(--line)]"></div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium text-[var(--sub)] hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
