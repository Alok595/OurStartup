"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageSquare, 
  Clock, 
  Users, 
  Loader2, 
  X,
  PhoneCall,
  UserCheck,
  UserX
} from "lucide-react";

type InterestedClientRecord = {
  _id: string;
  name: string;
  phone: string;
  status: "Interested" | "Rejected" | "Pending";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function InterestedClientsPage() {
  const [clients, setClients] = useState<InterestedClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Interested" | "Rejected" | "Pending">("All");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    status: "Interested" | "Rejected" | "Pending";
    notes: string;
  }>({
    name: "",
    phone: "",
    status: "Interested",
    notes: "",
  });

  // Action loading state for quick buttons
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/interested-clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to fetch interested clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setFormError("");
    setEditingId(null);
    setFormData({
      name: "",
      phone: "",
      status: "Interested",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (client: InterestedClientRecord) => {
    setFormError("");
    setEditingId(client._id);
    setFormData({
      name: client.name,
      phone: client.phone,
      status: client.status,
      notes: client.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter client name");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError("Please enter phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Edit existing
        const res = await fetch(`/api/interested-clients/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update client");
        }

        const updated = await res.json();
        setClients(clients.map((c) => (c._id === editingId ? updated : c)));
      } else {
        // Create new
        const res = await fetch("/api/interested-clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to add client");
        }

        const created = await res.json();
        setClients([created, ...clients]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick status update: "Interested" or "Rejected"
  const handleStatusChange = async (id: string, newStatus: "Interested" | "Rejected" | "Pending") => {
    setUpdatingId(id);
    // Optimistic UI update
    setClients((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );

    try {
      const res = await fetch(`/api/interested-clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert on error
      fetchClients();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    // Optimistic delete
    setClients((prev) => prev.filter((c) => c._id !== id));

    try {
      const res = await fetch(`/api/interested-clients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete client");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      fetchClients();
    }
  };

  // Filters & Search
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.toLowerCase().includes(search.toLowerCase()) ||
      (client.notes && client.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      selectedFilter === "All" || client.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Metrics
  const totalCount = clients.length;
  const interestedCount = clients.filter((c) => c.status === "Interested").length;
  const rejectedCount = clients.filter((c) => c.status === "Rejected").length;
  const pendingCount = clients.filter((c) => c.status === "Pending").length;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1
              className="text-3xl font-bold tracking-tight text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Interested Clients
            </h1>
            <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
            Save client names and phone numbers. Easily mark each client as Interested or Rejected.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Plus size={18} />
          <span>Save Client</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedFilter("All")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === "All"
              ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm"
              : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--sub)]/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-[var(--sub)]">
            <span>All Clients</span>
            <Users size={16} className="text-[var(--sub)]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            {totalCount}
          </p>
        </div>

        <div 
          onClick={() => setSelectedFilter("Interested")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === "Interested"
              ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
              : "border-[var(--line)] bg-[var(--bg)] hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span>Interested</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400" style={{ fontFamily: "var(--font-display)" }}>
            {interestedCount}
          </p>
        </div>

        <div 
          onClick={() => setSelectedFilter("Rejected")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === "Rejected"
              ? "border-rose-500 bg-rose-500/10 shadow-sm"
              : "border-[var(--line)] bg-[var(--bg)] hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-600 dark:text-rose-400">
            <span>Rejected</span>
            <XCircle size={16} className="text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400" style={{ fontFamily: "var(--font-display)" }}>
            {rejectedCount}
          </p>
        </div>

        <div 
          onClick={() => setSelectedFilter("Pending")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === "Pending"
              ? "border-amber-500 bg-amber-500/10 shadow-sm"
              : "border-[var(--line)] bg-[var(--bg)] hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-400">
            <span>Pending / Review</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400" style={{ fontFamily: "var(--font-display)" }}>
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
          <input
            type="text"
            placeholder="Search by name, phone number, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--ink)] placeholder:text-[var(--sub)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--line)] bg-black/[0.02] dark:bg-white/[0.02] self-start sm:self-auto overflow-x-auto max-w-full">
          {(["All", "Interested", "Rejected", "Pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === tab
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Table on desktop, Cards on mobile */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
            <p className="text-sm text-[var(--sub)]">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Users size={28} />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-base font-semibold text-[var(--ink)]">No clients found</h3>
              <p className="text-xs text-[var(--sub)]">
                {search || selectedFilter !== "All"
                  ? "No clients match your search or filter criteria."
                  : "You haven't saved any interested clients yet. Click below to add one."}
              </p>
            </div>
            {!search && selectedFilter === "All" && (
              <button
                onClick={openAddModal}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Save Client Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-semibold text-[var(--sub)] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Contact / Phone</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Action Decision</th>
                  <th className="py-3.5 px-6">Notes / Remarks</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-sm">
                {filteredClients.map((client) => {
                  const cleanPhone = client.phone.replace(/[^0-9]/g, "");
                  const isInterested = client.status === "Interested";
                  const isRejected = client.status === "Rejected";

                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 font-medium text-[var(--ink)] whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isInterested 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : isRejected
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-[var(--accent)]/10 text-[var(--accent)]"
                          }`}>
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{client.name}</p>
                            <p className="text-[11px] text-[var(--sub)]">
                              {new Date(client.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone / Contact */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[var(--ink)] font-medium">
                            {client.phone}
                          </span>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Direct Call Button */}
                            <a
                              href={`tel:${client.phone}`}
                              title="Call Client"
                              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--sub)] hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                            >
                              <PhoneCall size={14} />
                            </a>
                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Message on WhatsApp"
                              className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--sub)] hover:text-emerald-600 hover:border-emerald-500/40 transition-colors"
                            >
                              <MessageSquare size={14} />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isInterested ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={13} />
                            Interested
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <XCircle size={13} />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock size={13} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Two Action Decision Buttons: Interested & Reject */}
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          {/* Interested Button */}
                          <button
                            onClick={() => handleStatusChange(client._id, "Interested")}
                            disabled={updatingId === client._id}
                            title="Mark as Interested"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isInterested
                                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                                : "border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15"
                            }`}
                          >
                            <UserCheck size={14} />
                            <span>Interested</span>
                          </button>

                          {/* Reject Button */}
                          <button
                            onClick={() => handleStatusChange(client._id, "Rejected")}
                            disabled={updatingId === client._id}
                            title="Mark as Reject"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isRejected
                                ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/30"
                                : "border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/5 hover:bg-rose-500/15"
                            }`}
                          >
                            <UserX size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-6 max-w-xs truncate text-[var(--sub)] text-xs">
                        {client.notes ? (
                          <span title={client.notes}>{client.notes}</span>
                        ) : (
                          <span className="opacity-40 italic">No notes</span>
                        )}
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(client)}
                            title="Edit Client"
                            className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--sub)] hover:text-[var(--ink)] hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id, client.name)}
                            title="Delete Client"
                            className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--sub)] hover:text-rose-500 hover:border-rose-500/30 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                    {editingId ? "Edit Client" : "Save Interested Client"}
                  </h3>
                  <p className="text-xs text-[var(--sub)]">
                    Enter the client name, phone number, and status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="mt-4 flex flex-col gap-4 text-sm">
              {/* Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--ink)]">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--sub)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                />
              </div>

              {/* Phone number field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--ink)]">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--sub)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all"
                  />
                </div>
              </div>

              {/* Status Decision Buttons in Modal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--ink)]">
                  Client Status Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "Interested" })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.status === "Interested"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "border-[var(--line)] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>Interested</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "Rejected" })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.status === "Rejected"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "border-[var(--line)] text-rose-600 dark:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10"
                    }`}
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--ink)]">
                  Notes / Requirements <span className="text-[var(--sub)] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Interested in Mobile App & Website design; follow up on Monday"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--sub)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-all resize-none text-xs"
                />
              </div>

              {/* Form buttons */}
              <div className="mt-2 flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingId ? "Update Client" : "Save Client"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

