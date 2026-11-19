"use client";

import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon, X, ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    color: "#D9600A",
    liveUrl: "",
    heroImage: "",
    year: "",
    client: "",
    budget: "",
    duration: "",
    services: "", // Comma separated
    overview: "",
    challenge: "",
    solution: "",
    impact: "", // Comma separated
    gallery: [] as string[],
    featured: false,
    badge: ""
  });

  useEffect(() => {
    setIsMounted(true);
    if (!id) return;
    router.prefetch("/portfolio");
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        if (res.ok) {
          const json = await res.json();
          const p = json.data;
          setFormData({
            title: p.title || "",
            slug: p.slug || "",
            category: p.category || "",
            description: p.description || "",
            color: p.color || "#D9600A",
            liveUrl: p.liveUrl || "",
            heroImage: p.heroImage || "",
            year: p.year || "",
            client: p.client || "",
            budget: p.budget || "",
            duration: p.duration || "",
            services: p.services ? p.services.join(", ") : "",
            overview: p.overview || "",
            challenge: p.challenge || "",
            solution: p.solution || "",
            impact: p.impact ? p.impact.join(", ") : "",
            gallery: p.gallery || [],
            featured: p.featured || false,
            badge: p.badge || ""
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse comma-separated fields
    const payload = {
      ...formData,
      services: formData.services.split(",").map(s => s.trim()).filter(Boolean),
      impact: formData.impact.split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        try { sessionStorage.removeItem("admin_projects_cache"); } catch (e) {}
        router.push("/portfolio");
      } else {
        console.error("Failed to update project");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--ink)]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--sub)] font-medium">Failed to load project details.</p>
        <Link href="/portfolio" className="text-[var(--accent)] hover:underline">Return to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32 max-w-[1000px] mx-auto flex flex-col gap-8" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sub)] hover:text-[var(--ink)] transition-colors w-fit">
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Edit Project
          </h1>
          <p className="text-[var(--sub)]">
            Update case study details for {formData.title}
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdateProject} className="flex flex-col gap-10">
        
        {/* Basic Info */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>1. Basic Info</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Project Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="e.g. EcoCommerce App" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Category</label>
              <div className="relative">
                <select required={formData.category !== "Other"} value={["Web Development","Mobile Application","UI/UX Design","Backend Systems","AI / Machine Learning"].includes(formData.category) ? formData.category : formData.category ? "Other" : ""} onChange={e => { if (e.target.value === "Other") { setFormData({...formData, category: "Other"}); } else { setFormData({...formData, category: e.target.value}); }}} className="h-11 w-full rounded-xl border border-[var(--line)] bg-transparent px-4 pr-10 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] appearance-none cursor-pointer">
                  <option value="" disabled className="bg-[var(--bg)] text-[var(--ink)]">Select a category</option>
                  <option value="Web Development" className="bg-[var(--bg)] text-[var(--ink)]">Web Development</option>
                  <option value="Mobile Application" className="bg-[var(--bg)] text-[var(--ink)]">Mobile Application</option>
                  <option value="UI/UX Design" className="bg-[var(--bg)] text-[var(--ink)]">UI/UX Design</option>
                  <option value="Backend Systems" className="bg-[var(--bg)] text-[var(--ink)]">Backend Systems</option>
                  <option value="AI / Machine Learning" className="bg-[var(--bg)] text-[var(--ink)]">AI / Machine Learning</option>
                  <option value="Other" className="bg-[var(--bg)] text-[var(--ink)]">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub)] pointer-events-none" />
              </div>
              {(!["Web Development","Mobile Application","UI/UX Design","Backend Systems","AI / Machine Learning",""].includes(formData.category) || formData.category === "Other") && (
                <input
                  required
                  type="text"
                  value={formData.category === "Other" ? "" : formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value || "Other"})}
                  className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)] mt-1.5"
                  placeholder="Enter custom category name..."
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Short Description (Card View)</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[80px] rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)] resize-y" placeholder="Briefly describe the project..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Theme Color</label>
              <input required type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="h-11 w-full rounded-xl cursor-pointer bg-transparent outline-none p-1 border border-[var(--line)]" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-[var(--ink)]">Live URL (Optional)</label>
              <input type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="https://" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 p-4 rounded-xl border border-[var(--line)] bg-black/[0.02] dark:bg-white/[0.02]">
            <input 
              type="checkbox" 
              id="featured-toggle"
              checked={formData.featured}
              onChange={e => setFormData({...formData, featured: e.target.checked})}
              className="w-5 h-5 rounded border border-[var(--line)] accent-[var(--accent)] cursor-pointer"
            />
            <label htmlFor="featured-toggle" className="text-sm font-semibold text-[var(--ink)] cursor-pointer">
              Mark as Featured Project
              <span className="block text-xs font-normal text-[var(--sub)] mt-0.5">Featured projects will appear in the "Selected Work" section on the home page.</span>
            </label>
          </div>
        </div>

        {/* Project Metadata */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>2. Project Metadata</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Client Name</label>
              <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Premium Badge (Optional)</label>
              <div className="relative">
                <select value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="h-11 w-full rounded-xl border border-[var(--line)] bg-transparent px-4 pr-10 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] appearance-none cursor-pointer">
                  <option value="" className="bg-[var(--bg)] text-[var(--ink)]">None</option>
                  <option value="Premium" className="bg-[var(--bg)] text-[var(--ink)]">Premium</option>
                  <option value="Featured" className="bg-[var(--bg)] text-[var(--ink)]">Featured</option>
                  <option value="Top Choice" className="bg-[var(--bg)] text-[var(--ink)]">Top Choice</option>
                  <option value="Enterprise" className="bg-[var(--bg)] text-[var(--ink)]">Enterprise</option>
                  <option value="Startup" className="bg-[var(--bg)] text-[var(--ink)]">Startup</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub)] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Year</label>
              <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="2024" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Budget</label>
              <div className="relative">
                <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="h-11 w-full rounded-xl border border-[var(--line)] bg-transparent px-4 pr-10 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] appearance-none cursor-pointer">
                  <option value="" disabled className="bg-[var(--bg)] text-[var(--ink)]">Select a budget</option>
                  <option value="Under $10k" className="bg-[var(--bg)] text-[var(--ink)]">Under $10k</option>
                  <option value="$10k - $25k" className="bg-[var(--bg)] text-[var(--ink)]">$10k - $25k</option>
                  <option value="$25k - $50k" className="bg-[var(--bg)] text-[var(--ink)]">$25k - $50k</option>
                  <option value="$50k - $100k" className="bg-[var(--bg)] text-[var(--ink)]">$50k - $100k</option>
                  <option value="$100k+" className="bg-[var(--bg)] text-[var(--ink)]">$100k+</option>
                  <option value="Undisclosed" className="bg-[var(--bg)] text-[var(--ink)]">Undisclosed</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub)] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Duration</label>
              <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="12 Weeks" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Services Provided (Comma separated)</label>
            <input type="text" value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="UI/UX, Backend, Frontend" />
          </div>
        </div>

        {/* Media */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>3. Media & Assets</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Hero Image (Cloudinary)</label>
            {formData.heroImage ? (
              <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-[var(--line)] w-full max-w-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, heroImage: ""})} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <X size={16} />
                </button>
              </div>
            ) : isMounted ? (
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ourstartup"} 
                onSuccess={(result: any) => setFormData(prev => ({...prev, heroImage: result.info.secure_url}))}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="h-32 max-w-sm border-2 border-dashed border-[var(--line)] rounded-2xl flex flex-col items-center justify-center text-[var(--sub)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm font-medium">Upload Hero Image</span>
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <button type="button" disabled className="h-32 max-w-sm border-2 border-dashed border-[var(--line)] rounded-2xl flex flex-col items-center justify-center text-[var(--sub)]">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-sm font-medium">Upload Hero Image</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Gallery Images</label>
            <div className="flex gap-3 flex-wrap">
              {formData.gallery.map((img, i) => (
                <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-transform">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {isMounted ? (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ourstartup"} 
                  onSuccess={(result: any) => setFormData(prev => ({...prev, gallery: [...prev.gallery, result.info.secure_url]}))}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="h-24 w-24 border-2 border-dashed border-[var(--line)] rounded-xl flex flex-col items-center justify-center text-[var(--sub)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                      <Plus size={20} className="mb-1" />
                      <span className="text-xs font-medium">Add</span>
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <button type="button" disabled className="h-24 w-24 border-2 border-dashed border-[var(--line)] rounded-xl flex flex-col items-center justify-center text-[var(--sub)]">
                  <Plus size={20} className="mb-1" />
                  <span className="text-xs font-medium">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Deep Dive */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>4. Case Study Details</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Detailed Overview</label>
            <textarea value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} className="min-h-[120px] rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)] resize-y" placeholder="Deep dive into the project background..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">The Challenge</label>
              <textarea value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} className="min-h-[120px] rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)] resize-y" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">The Solution</label>
              <textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="min-h-[120px] rounded-xl border border-[var(--line)] bg-transparent p-4 text-sm outline-none focus:border-[var(--accent)] resize-y" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[var(--ink)]">Impact / Results (Comma separated)</label>
            <input type="text" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--accent)]" placeholder="30% Growth, 10k active users, etc." />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[var(--line)] pb-20">
          <Link href="/portfolio" className="px-6 h-12 flex items-center justify-center rounded-full border border-[var(--line)] font-medium text-[var(--ink)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
            Cancel
          </Link>
          <button disabled={isSubmitting} type="submit" className="px-8 h-12 flex flex-1 sm:flex-none items-center justify-center rounded-full bg-[var(--accent)] font-semibold text-white hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-xl" style={{ boxShadow: `0 10px 30px -10px var(--accent)` }}>
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
