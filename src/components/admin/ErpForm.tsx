"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, X } from "lucide-react";

export type ErpFormValues = {
  title: string;
  description: string;
  heroImage: string;
  gallery: string[];
  liveUrl: string;
  color: string;
  freeTrial: boolean;
  erpFeatured: boolean;
  showInWork: boolean;
  features: string; // one per line
  overview: string;
  challenge: string;
  solution: string;
  category: string;
  badge: string;
};

export const EMPTY_ERP: ErpFormValues = {
  title: "",
  description: "",
  heroImage: "",
  gallery: [],
  liveUrl: "",
  color: "#4F46E5",
  freeTrial: false,
  erpFeatured: false,
  showInWork: false,
  features: "",
  overview: "",
  challenge: "",
  solution: "",
  category: "ERP System",
  badge: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function erpToForm(p: any): ErpFormValues {
  return {
    title: p.title || "",
    description: p.description || "",
    heroImage: p.heroImage || "",
    gallery: p.gallery || [],
    liveUrl: p.liveUrl || "",
    color: p.color || "#4F46E5",
    freeTrial: !!p.freeTrial,
    erpFeatured: !!p.erpFeatured,
    showInWork: p.showInWork !== false,
    features: (p.erpFeatures || []).join("\n"),
    overview: p.overview || "",
    challenge: p.challenge || "",
    solution: p.solution || "",
    category: p.category || "ERP System",
    badge: p.badge || "",
  };
}

const noopSubscribe = () => () => {};

function Toggle({ checked, onChange, title, hint }: { checked: boolean; onChange: (v: boolean) => void; title: string; hint: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-black/[0.02] p-4 dark:bg-white/[0.02]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 cursor-pointer accent-[var(--accent)]" />
      <span className="text-sm font-semibold text-[var(--ink)]">
        {title}
        <span className="mt-0.5 block text-xs font-normal text-[var(--sub)]">{hint}</span>
      </span>
    </label>
  );
}

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ourstartup";
const input = "h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]";
const area = "min-h-[110px] rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)] resize-y";

/** Add / edit form for the admin "ERP Systems" section. Saves into the shared Project collection with isErp = true. */
export default function ErpForm({ id, initial = EMPTY_ERP }: { id?: string; initial?: ErpFormValues }) {
  const router = useRouter();
  const [form, setForm] = useState<ErpFormValues>(initial);
  // true only in the browser — the Cloudinary widget must not render during prerender
  const isMounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    router.prefetch("/erp-manager");
  }, [router]);

  const set = <K extends keyof ErpFormValues>(key: K, value: ErpFormValues[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { features, ...rest } = form;
    const payload = {
      ...rest,
      isErp: true,
      erpFeatures: features.split(/\n|,/).map((s) => s.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(id ? `/api/portfolio/${id}` : "/api/portfolio", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      try {
        sessionStorage.removeItem("admin_projects_cache");
      } catch {}
      router.push("/erp-manager");
    } catch {
      setError("Could not save the ERP. If the name matches an existing project, try a different name.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-8 p-6 pb-32 md:p-10" style={{ fontFamily: "var(--font-body)" }}>
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6">
        <Link href="/erp-manager" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--sub)] transition-colors hover:text-[var(--ink)]">
          <ArrowLeft size={16} /> Back to ERP Systems
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          {id ? "Edit ERP" : "Add New ERP"}
        </h1>
        <p className="text-[var(--sub)]">Name, image and a short detail are all you need — everything else is optional and fills the ERP detail page.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-10">
        {/* Basics */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>1. Basics</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">ERP Name</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={input} placeholder="e.g. TechKhata — Mobile Shop Management System" />
            <span className="text-xs text-[var(--sub)]">Tip: write it as “Brand — What it is” and the site shows the brand and name separately.</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Short Detail (card text)</label>
            <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-[80px] resize-y rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="One or two lines about what this ERP does…" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-[var(--ink)]">Live / Free-trial URL (optional)</label>
              <input type="url" value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} className={input} placeholder="https://" />
              <span className="text-xs text-[var(--sub)]">Leave empty and the button becomes “Book a free demo” on WhatsApp.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Theme Color</label>
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-[var(--line)] bg-transparent p-1 outline-none" />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>2. Visibility</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle checked={form.freeTrial} onChange={(v) => set("freeTrial", v)} title="Free trial available" hint="Shows a “Free trial” stamp and button." />
            <Toggle checked={form.erpFeatured} onChange={(v) => set("erpFeatured", v)} title="Show on Home page" hint="The home ERP section shows 2 ERPs — these come first." />
            <Toggle checked={form.showInWork} onChange={(v) => set("showInWork", v)} title="Also show in Our Work" hint="Off = only on the ERP page." />
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>3. Images</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Main Image (card cover)</label>
            {form.heroImage ? (
              <div className="relative h-48 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line)] sm:h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.heroImage} alt="Main" className="h-full w-full object-cover object-left-top" />
                <button type="button" onClick={() => set("heroImage", "")} className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110">
                  <X size={16} />
                </button>
              </div>
            ) : isMounted ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <CldUploadWidget uploadPreset={UPLOAD_PRESET} onSuccess={(r: any) => set("heroImage", r.info.secure_url)}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="flex h-32 max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--line)] text-[var(--sub)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm font-medium">Upload Main Image</span>
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <div className="h-32 max-w-sm rounded-2xl border-2 border-dashed border-[var(--line)]" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">More Screens (shown on the detail page)</label>
            <div className="flex flex-wrap gap-3">
              {form.gallery.map((img, i) => (
                <div key={img + i} className="relative h-24 w-36 overflow-hidden rounded-xl border border-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Screen" className="h-full w-full object-cover object-left-top" />
                  <button type="button" onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-transform hover:scale-110">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {isMounted && (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <CldUploadWidget uploadPreset={UPLOAD_PRESET} onSuccess={(r: any) => setForm((f) => ({ ...f, gallery: [...f.gallery, r.info.secure_url] }))}>
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="flex h-24 w-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--line)] text-[var(--sub)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                      <Plus size={20} className="mb-1" />
                      <span className="text-xs font-medium">Add screen</span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>4. Full Details (optional)</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Features / Modules (one per line)</label>
            <textarea value={form.features} onChange={(e) => set("features", e.target.value)} className={area} placeholder={"Billing & GST invoices\nInventory\nReports & P&L"} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">About this ERP</label>
            <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} className={area} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">The problem it solves</label>
              <textarea value={form.challenge} onChange={(e) => set("challenge", e.target.value)} className={area} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">How it solves it</label>
              <textarea value={form.solution} onChange={(e) => set("solution", e.target.value)} className={area} />
            </div>
          </div>
        </div>

        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex items-center gap-4 border-t border-[var(--line)] pb-20 pt-6">
          <Link href="/erp-manager" className="flex h-12 items-center justify-center rounded-full border border-[var(--line)] px-6 font-medium text-[var(--ink)] transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
            Cancel
          </Link>
          <button disabled={saving} type="submit" className="flex h-12 flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-8 font-semibold text-white shadow-xl transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 sm:flex-none">
            {saving ? <Loader2 className="animate-spin" size={18} /> : id ? "Save Changes" : "Publish ERP"}
          </button>
        </div>
      </form>
    </div>
  );
}
