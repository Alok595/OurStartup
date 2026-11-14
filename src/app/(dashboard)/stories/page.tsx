"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Trash2, Check, X, Star } from "lucide-react";

type Testimonial = {
  _id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
};

export default function StoriesPage() {
  const AdminStorySkeleton = () => (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-1"><div className="h-4 w-20 bg-black/5 dark:bg-white/5 animate-pulse rounded" /></div>
        <div className="h-6 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" />
      </div>
      <div className="h-16 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded mt-2" />
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--line)]/50">
        <div className="h-10 w-10 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-3 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  const [stories, setStories] = useState<Testimonial[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("admin_stories_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("admin_stories_cache")) return false;
      } catch (e) {}
    }
    return true;
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/testimonials?admin=true");
      if (res.ok) {
        const data = await res.json();
        setStories(data);
        try {
          sessionStorage.setItem("admin_stories_cache", JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setStories(stories.map(s => s._id === id ? { ...s, isApproved: !currentStatus } : s));
    
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchStories(); // Revert on error
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    
    // Optimistic update
    setStories(stories.filter(s => s._id !== id));
    
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchStories(); // Revert on error
    }
  };

  const filteredStories = stories.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.company.toLowerCase().includes(search.toLowerCase()) ||
    s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Client Stories
          </h1>
          <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
            Manage and approve public testimonials.
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
          <input 
            type="text" 
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--accent)] transition-colors w-full sm:w-64"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminStorySkeleton />
          <AdminStorySkeleton />
          <AdminStorySkeleton />
          <AdminStorySkeleton />
          <AdminStorySkeleton />
          <AdminStorySkeleton />
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg)]/50 p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
          <div className="h-12 w-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <Star size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>No stories yet</h3>
            <p className="text-sm text-[var(--sub)] mt-1 max-w-sm mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              When clients submit reviews on your public site, they will appear here for approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div key={story._id} className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 shadow-sm flex flex-col gap-4 relative group">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{story.name}</h3>
                  {story.company && <p className="text-xs text-[var(--sub)] mt-0.5">{story.company}</p>}
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < story.rating ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-[var(--line)] text-[var(--line)]"} />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-[var(--ink)]/80 leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>
                "{story.content}"
              </p>
              
              <div className="mt-auto pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <span className="text-xs text-[var(--sub)]">
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleApproval(story._id, story.isApproved)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      story.isApproved 
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                        : "bg-[var(--line)]/50 text-[var(--sub)] hover:bg-[var(--line)]"
                    }`}
                  >
                    {story.isApproved ? <><Check size={14}/> Approved</> : <><X size={14}/> Hidden</>}
                  </button>
                  <button 
                    onClick={() => deleteStory(story._id)}
                    className="p-1.5 rounded-full text-[var(--sub)] hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
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
