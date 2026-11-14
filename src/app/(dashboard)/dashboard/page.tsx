"use client";

import { motion } from "framer-motion";
import { Users, Mail, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Inline icon component for Briefcase
function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

export default function DashboardOverview() {
  const [data, setData] = useState<{stats: any, recentActivity: any[]}>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("admin_overview_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return { stats: null, recentActivity: [] };
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("admin_overview_cache")) return false;
      } catch (e) {}
    }
    return true;
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          try {
            sessionStorage.setItem("admin_overview_cache", JSON.stringify(json.data));
          } catch (e) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsList = [
    { label: "Total Leads", value: data.stats?.totalLeads || "0", trend: "+12.5%", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Projects", value: data.stats?.totalProjects || "0", trend: "+2", icon: BriefcaseIcon, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
    { label: "Client Stories", value: data.stats?.totalStories || "0", trend: "+1", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Conversion Rate", value: data.stats?.conversionRate || "0%", trend: "+0.4%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          Overview
        </h1>
        <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
          Here's what's happening with your agency today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center py-10">
            <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
          </div>
        ) : statsList.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                <span className="text-3xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</span>
                <span className="text-sm font-medium text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm overflow-hidden"
      >
        <div className="border-b border-[var(--line)] p-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>Recent Activity</h2>
          <button className="text-sm font-medium text-[var(--accent)] hover:underline" style={{ fontFamily: "var(--font-body)" }}>View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
            <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-xs uppercase bg-[var(--bg)]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[var(--ink)]">Action</th>
                <th className="px-6 py-4 font-semibold text-[var(--ink)]">Target</th>
                <th className="px-6 py-4 font-semibold text-[var(--ink)]">Time</th>
                <th className="px-6 py-4 font-semibold text-[var(--ink)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center"><Loader2 className="animate-spin inline text-[var(--accent)]" /></td>
                </tr>
              ) : data.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[var(--sub)]">No recent activity found.</td>
                </tr>
              ) : data.recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--ink)]">{activity.action}</td>
                  <td className="px-6 py-4">{activity.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(activity.time).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${activity.type === 'lead' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}
                    `}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
