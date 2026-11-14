"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical, Loader2 } from "lucide-react";

type Lead = {
  _id: string;
  name: string;
  email: string;
  types: string[];
  budget: string;
  timeline: string;
  details: string;
  status: string;
  dealAmount: number;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Contacted": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "In Progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Completed": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Lost": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUSES = ["New", "Contacted", "In Progress", "Completed", "Lost"];

export default function LeadsPage() {
  const AdminLeadSkeleton = () => (
    <tr className="border-b border-[var(--line)]/50">
      <td className="p-4 whitespace-nowrap"><div className="h-4 w-24 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-4 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-4 w-28 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-4 w-20 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-4 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-6 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" /></td>
      <td className="p-4 whitespace-nowrap"><div className="h-8 w-8 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" /></td>
    </tr>
  );

  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("admin_leads_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("admin_leads_cache")) return false;
      } catch (e) {}
    }
    return true;
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        try {
          sessionStorage.setItem("admin_leads_cache", JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    // Optimistic update
    setLeads(leads.map(l => l._id === id ? { ...l, ...updates } : l));
    
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error(err);
      // Revert on error (simple reload)
      fetchLeads();
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Leads
          </h1>
          <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
            Manage your incoming contact form submissions here.
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
          <input 
            type="text" 
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--accent)] transition-colors w-full sm:w-64"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-[var(--sub)] font-medium border-b border-[var(--line)]">
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Budget</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Project Type</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AdminLeadSkeleton />
                <AdminLeadSkeleton />
                <AdminLeadSkeleton />
                <AdminLeadSkeleton />
                <AdminLeadSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg)]/50 p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>No leads yet</h3>
            <p className="text-sm text-[var(--sub)] mt-1 max-w-sm mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              When users submit the contact form on your public site, their inquiries will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-xs uppercase bg-[var(--bg)]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Client</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Project Interest</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Budget & Timeline</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Status</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Deal Amount ($)</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--ink)]">{lead.name}</div>
                      <div className="text-xs mt-0.5">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lead.types.map(t => (
                          <span key={t} className="inline-flex rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[var(--bg)]">
                            {t.replace("development", "dev").replace("design", "dsgn")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[var(--ink)] font-medium">{lead.budget || "—"}</div>
                      <div className="text-xs mt-0.5">{lead.timeline || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLead(lead._id, { status: e.target.value })}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 outline-none cursor-pointer appearance-none ${STATUS_COLORS[lead.status] || STATUS_COLORS["New"]}`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s} className="bg-[var(--bg)] text-[var(--ink)]">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--sub)] font-medium">$</span>
                        <input 
                          type="number" 
                          value={lead.dealAmount || ""}
                          onChange={(e) => updateLead(lead._id, { dealAmount: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full h-8 pl-6 pr-2 rounded-lg border border-transparent hover:border-[var(--line)] focus:border-[var(--accent)] bg-transparent focus:bg-[var(--bg)] outline-none text-[var(--ink)] font-medium transition-all"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
