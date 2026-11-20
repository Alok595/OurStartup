"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, Edit, ExternalLink, Eye, Home, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { DEFAULT_ERPS } from "@/lib/erp";

type Erp = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  color: string;
  category?: string;
  heroImage?: string;
  gallery?: string[];
  liveUrl?: string;
  freeTrial?: boolean;
  erpFeatured?: boolean;
  showInWork?: boolean;
  isErp?: boolean;
  erpFeatures?: string[];
};

function clearCache() {
  try {
    sessionStorage.removeItem("admin_projects_cache");
  } catch {}
}

async function fetchProjects(): Promise<Erp[] | null> {
  try {
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    return res.ok ? (await res.json()).data || [] : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const put = (id: string, body: Partial<Erp>) =>
  fetch(`/api/portfolio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export default function ErpManagerPage() {
  // All projects: ERPs are the ones flagged isErp, the rest can be picked from the dropdown.
  const [projects, setProjects] = useState<Erp[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [pick, setPick] = useState("");
  const [adding, setAdding] = useState(false);

  const erps = projects.filter((p) => p.isErp);
  const candidates = projects.filter((p) => !p.isErp);

  const update = (id: string, changes: Partial<Erp>) => setProjects((all) => all.map((p) => (p._id === id ? { ...p, ...changes } : p)));

  const load = async () => {
    const data = await fetchProjects();
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    let alive = true;
    fetchProjects().then((data) => {
      if (!alive) return;
      if (data) setProjects(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  /** Turn an existing project into an ERP — it stays in Our Work too. */
  const addFromProject = async () => {
    if (!pick) return;
    setAdding(true);
    update(pick, { isErp: true });
    clearCache();
    try {
      const res = await put(pick, { isErp: true });
      if (!res.ok) await load();
    } finally {
      setPick("");
      setAdding(false);
    }
  };

  const patch = async (erp: Erp, body: Partial<Erp>) => {
    update(erp._id, body);
    clearCache();
    const res = await put(erp._id, body);
    if (!res.ok) load();
  };

  const remove = async (erp: Erp) => {
    const onlyErp = erp.showInWork === false;
    const ok = confirm(
      onlyErp
        ? `Delete "${erp.title}"? It is only listed as an ERP, so it will be removed completely.`
        : `Remove "${erp.title}" from the ERP page? It will stay in Our Work.`
    );
    if (!ok) return;
    clearCache();
    if (onlyErp) {
      setProjects((all) => all.filter((p) => p._id !== erp._id));
      await fetch(`/api/portfolio/${erp._id}`, { method: "DELETE" });
      return;
    }
    const changes = { isErp: false, erpFeatured: false, showInWork: true };
    update(erp._id, changes);
    await put(erp._id, changes);
  };

  const importDefaults = async () => {
    setImporting(true);
    try {
      for (const d of DEFAULT_ERPS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...data } = d;
        const existing = projects.find((p) => p.slug === d.slug || p.title.trim() === d.title.trim());
        if (existing) {
          // already saved as a project — just switch on its ERP settings
          await put(existing._id, { isErp: true, freeTrial: d.freeTrial, erpFeatured: d.erpFeatured, erpFeatures: d.erpFeatures });
        } else {
          await fetch("/api/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }
      }
      clearCache();
      await load();
    } finally {
      setImporting(false);
    }
  };

  const filtered = erps.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const onHome = erps.filter((e) => e.erpFeatured).length;

  return (
    <div className="relative mx-auto flex max-w-[1400px] flex-col gap-8 p-6 md:p-10" style={{ fontFamily: "var(--font-body)" }}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            ERP Systems
          </h1>
          <p className="text-[var(--sub)]">
            Everything here appears on the public <span className="font-semibold text-[var(--ink)]">/erp</span> page. The home page shows 2 ERPs —
            the ones marked <span className="font-semibold text-[var(--ink)]">Home</span> first ({onHome} marked).
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
            <input
              type="text"
              placeholder="Search ERPs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-full border border-[var(--line)] bg-[var(--bg)] pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            />
          </div>
          <Link href="/erp-manager/new" className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-transform hover:scale-105">
            <Plus size={18} />
            <span className="hidden sm:inline">New ERP</span>
          </Link>
        </div>
      </div>

      {/* Add an existing project as an ERP */}
      {!loading && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-black/[0.02] p-4 dark:bg-white/[0.02] sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--ink)]">Add from existing projects</p>
            <p className="text-xs text-[var(--sub)]">Pick a project from Our Work to also list it as an ERP. It stays in Our Work.</p>
          </div>
          <div className="relative w-full sm:w-96">
            <select
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              disabled={candidates.length === 0}
              className="h-10 w-full cursor-pointer appearance-none rounded-full border border-[var(--line)] bg-[var(--bg)] pl-4 pr-10 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] disabled:opacity-60"
            >
              <option value="">{candidates.length ? "Choose a project…" : "All projects are already ERPs"}</option>
              {candidates.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                  {p.category ? ` — ${p.category}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
          </div>
          <button
            onClick={addFromProject}
            disabled={!pick || adding}
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add to ERP
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin text-[var(--ink)]" size={28} />
        </div>
      ) : erps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[var(--line)] px-6 py-20 text-center text-[var(--sub)]">
          <p className="max-w-md">
            No ERPs saved yet — the website is currently showing the built-in TechKhata and Star Pharma. Import them (projects with the same name
            are reused), pick a project above, or create a new ERP.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={importDefaults}
              disabled={importing}
              className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] px-5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] disabled:opacity-60"
            >
              {importing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Import built-in ERPs
            </button>
            <Link href="/erp-manager/new" className="flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white">
              <Plus size={16} /> New ERP
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((erp) => (
            <div key={erp._id} className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm">
              <div className="h-1.5 w-full" style={{ backgroundColor: erp.color }} />
              <div
                className="relative h-40 w-full border-b border-[var(--line)] bg-cover bg-left-top"
                style={{ backgroundColor: `${erp.color}18`, backgroundImage: erp.heroImage ? `url(${erp.heroImage})` : undefined }}
              >
                {!erp.heroImage && (
                  <span className="absolute inset-0 grid place-items-center text-5xl font-black" style={{ color: erp.color, fontFamily: "var(--font-display)" }}>
                    {erp.title.charAt(0)}
                  </span>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {erp.erpFeatured && <span className="rounded-full bg-[#0E0E10] px-2 py-0.5 text-[10px] font-bold uppercase text-[#CCFF2E]">Home</span>}
                  {erp.freeTrial && <span className="rounded-full bg-[#FFD23F] px-2 py-0.5 text-[10px] font-bold uppercase text-[#0E0E10]">Free trial</span>}
                  {erp.showInWork !== false && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-[#0E0E10]">In Work</span>}
                </div>
                {(erp.gallery?.length ?? 0) > 0 && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                    +{erp.gallery!.length} screens
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-lg font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  {erp.title}
                </h3>
                <p className="line-clamp-2 text-sm text-[var(--sub)]">{erp.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => patch(erp, { erpFeatured: !erp.erpFeatured })}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      erp.erpFeatured ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--line)] text-[var(--sub)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Home size={12} /> {erp.erpFeatured ? "On home" : "Show on home"}
                  </button>
                  <button
                    onClick={() => patch(erp, { freeTrial: !erp.freeTrial })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      erp.freeTrial ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--line)] text-[var(--sub)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {erp.freeTrial ? "Free trial on" : "Free trial off"}
                  </button>
                  <button
                    onClick={() => patch(erp, { showInWork: erp.showInWork === false })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      erp.showInWork !== false ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--line)] text-[var(--sub)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {erp.showInWork !== false ? "In Our Work" : "Add to Our Work"}
                  </button>
                </div>

                <div className="mt-auto flex items-center gap-3 border-t border-[var(--line)] pt-4 text-xs font-medium text-[var(--sub)]">
                  <Link href={`/erp-manager/edit/${erp._id}`} className="flex items-center gap-1 hover:text-[var(--accent)]">
                    <Edit size={14} /> Edit
                  </Link>
                  <a href={`/erp/${erp.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--accent)]">
                    <Eye size={14} /> View
                  </a>
                  {erp.liveUrl && (
                    <a href={erp.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--accent)]">
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                  <button onClick={() => remove(erp)} className="ml-auto flex items-center gap-1 hover:text-red-500">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
