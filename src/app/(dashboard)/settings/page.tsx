"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Loader2, ShieldAlert } from "lucide-react";

type Admin = {
  _id: string;
  email: string;
  createdAt: string;
};

export default function SettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admins");
      if (res.ok) {
        const json = await res.json();
        setAdmins(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    
    setIsAdding(true);
    setError("");
    
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        setError(json.error || "Failed to add admin");
      } else {
        setNewEmail("");
        fetchAdmins();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to revoke admin access for this email?")) return;
    
    try {
      const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAdmins();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
          Manage your application settings and administrative access.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <ShieldAlert size={20} className="text-[var(--accent)]" />
            Admin Access Management
          </h2>
          <p className="text-sm text-[var(--sub)] mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Authorized Google Accounts that can log into this dashboard. Note: The primary admin email set in your environment variables always has access and cannot be removed here.
          </p>
        </div>

        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 rounded-2xl border border-[var(--line)] bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex-1 w-full">
            <input 
              type="email" 
              required
              placeholder="Enter Gmail address to authorize..."
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 text-sm outline-none focus:border-[var(--accent)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isAdding}
            className="h-11 px-6 rounded-xl bg-[var(--ink)] text-[var(--bg)] font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Authorize Email
          </button>
        </form>
        
        {error && <p className="text-sm text-red-500 font-medium" style={{ fontFamily: "var(--font-body)" }}>{error}</p>}

        <div className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--sub)] mb-4" style={{ fontFamily: "var(--font-mono)" }}>Authorized Accounts</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[var(--accent)]" /></div>
          ) : admins.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[var(--line)] rounded-2xl text-[var(--sub)] text-sm" style={{ fontFamily: "var(--font-body)" }}>
              No additional admins authorized yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {admins.map(admin => (
                <div key={admin._id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--line)] hover:border-[var(--accent)]/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--ink)] text-sm" style={{ fontFamily: "var(--font-body)" }}>{admin.email}</span>
                    <span className="text-xs text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Added {new Date(admin.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="p-2 text-[var(--sub)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Revoke Access"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
