"use client";

import { useEffect, useState } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Search, Plus, Trash2, Loader2, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  liveUrl?: string;
  heroImage?: string;
  year?: string;
  client?: string;
  budget?: string;
  duration?: string;
  services?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  gallery?: string[];
  createdAt: string;
};

export default function PortfolioAdminPage() {
  const AdminProjectSkeleton = () => (
    <div className="flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden shadow-sm">
      <div className="h-40 w-full bg-black/5 dark:bg-white/5 animate-pulse border-b border-[var(--line)]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 w-24 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        <div className="h-6 w-3/4 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        <div className="h-10 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded mt-2" />
      </div>
    </div>
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const json = await res.json();
        setProjects(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjects(projects.filter(p => p._id !== id));
    try {
      await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${display.variable} ${body.variable} p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8 relative`} style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Portfolio Projects
          </h1>
          <p className="text-[var(--sub)]">
            Manage your selected work and case studies.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
            <input 
              type="text" 
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--accent)] transition-colors w-full"
            />
          </div>
          <Link 
            href="/portfolio/new"
            className="flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-transform hover:scale-105 shrink-0"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Project</span>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminProjectSkeleton />
          <AdminProjectSkeleton />
          <AdminProjectSkeleton />
          <AdminProjectSkeleton />
          <AdminProjectSkeleton />
          <AdminProjectSkeleton />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--sub)] border border-dashed border-[var(--line)] rounded-3xl">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden shadow-sm group">
              <div 
                className="h-40 w-full relative flex items-center justify-center border-b border-[var(--line)] bg-cover bg-center"
                style={{ 
                  backgroundColor: `${project.color}15`,
                  backgroundImage: project.heroImage ? `url(${project.heroImage})` : undefined
                }}
              >
                {!project.heroImage && (
                  <>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(${project.color} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                    <div className="h-16 w-16 rounded-full blur-[20px]" style={{ backgroundColor: project.color }} />
                  </>
                )}
                {project.heroImage && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/portfolio/edit/${project._id}`}
                      className="text-[var(--sub)] hover:text-[var(--accent)] transition-colors p-1"
                      title="Edit Project"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => deleteProject(project._id)}
                      className="text-[var(--sub)] hover:text-red-500 transition-colors p-1"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--sub)] line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-auto pt-4 flex gap-3 text-xs font-medium text-[var(--sub)]">
                  <span className="truncate">Slug: /{project.slug}</span>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--accent)] ml-auto">
                      <ExternalLink size={12} /> Live URL
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
