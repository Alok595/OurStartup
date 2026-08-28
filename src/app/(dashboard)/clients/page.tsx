"use client";

import React, { useEffect, useState } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Search, Plus, Trash2, Edit, X, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

type ClientRecord = {
  _id: string;
  name: string;
  phone: string;
  dealAmount: number;
  paid: number;
  due: number;
  startDate: string;
  endDate?: string;
  projectEmail?: string;
  projectPassword?: string;
  projectLinks: string[];
  createdAt: string;
};

export default function ClientsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dealAmount: "" as any,
    paid: "" as any,
    startDate: "",
    endDate: "",
    projectEmail: "",
    projectPassword: "",
    projectLinks: [""],
  });

  const openEditModal = (client: ClientRecord) => {
    setFormError("");
    setEditingId(client._id);
    setFormData({
      name: client.name,
      phone: client.phone,
      dealAmount: client.dealAmount,
      paid: client.paid,
      startDate: client.startDate ? new Date(client.startDate).toISOString().split('T')[0] : "",
      endDate: client.endDate ? new Date(client.endDate).toISOString().split('T')[0] : "",
      projectEmail: client.projectEmail || "",
      projectPassword: client.projectPassword || "",
      projectLinks: client.projectLinks && client.projectLinks.length > 0 ? client.projectLinks : [""],
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormError("");
    setEditingId(null);
    setFormData({ 
      name: "", phone: "", dealAmount: "" as any, paid: "" as any, 
      startDate: "", endDate: "", projectEmail: "", 
      projectPassword: "", projectLinks: [""] 
    });
    setIsModalOpen(true);
  };

  const handleAddLink = () => {
    setFormData({ ...formData, projectLinks: [...formData.projectLinks, ""] });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.projectLinks];
    newLinks[index] = value;
    setFormData({ ...formData, projectLinks: newLinks });
  };
  
  const handleRemoveLink = (index: number) => {
    const newLinks = formData.projectLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, projectLinks: newLinks });
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin@123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: string, updates: Partial<ClientRecord>) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    try {
      const url = editingId ? `/api/clients/${editingId}` : "/api/clients";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dealAmount: Number(formData.dealAmount) || 0,
          paid: Number(formData.paid) || 0,
          projectLinks: formData.projectLinks.filter(l => l.trim() !== ""), // Only send non-empty links
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} client`);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ 
        name: "", phone: "", dealAmount: "" as any, paid: "" as any, 
        startDate: "", endDate: "", projectEmail: "", 
        projectPassword: "", projectLinks: [""] 
      });
      fetchClients();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Something went wrong while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`${display.variable} ${body.variable} min-h-[70vh] flex items-center justify-center p-6`}>
        <div className="w-full max-w-md bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-center text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Protected Area
          </h2>
          <p className="text-[var(--sub)] text-center text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Please enter the section password to view client records.
          </p>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-11 px-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {authError && <p className="text-red-500 text-xs mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className={`${display.variable} ${body.variable} p-6 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-8`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Clients
          </h1>
          <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
            Manage client records, financial deals, and project timelines.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sub)]" />
            <input 
              type="text" 
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--accent)] transition-colors w-full sm:w-64"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <button
            onClick={openAddModal}
            className="h-10 px-5 bg-[var(--ink)] text-[var(--bg)] rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Plus size={16} />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg)]/50 p-12 text-center flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>No clients found</h3>
          <p className="text-sm text-[var(--sub)] mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Add your first client to start tracking their records.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] text-xs uppercase bg-[var(--bg)] border-b border-[var(--line)]">
                <tr>
                  <th className="w-10 px-4 py-4"></th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Name</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Phone</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Deal Amount</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Paid</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Due</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">Start Date</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)]">End Date</th>
                  <th className="px-6 py-4 font-semibold text-[var(--ink)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredClients.map((client) => (
                  <React.Fragment key={client._id}>
                  <tr className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => toggleRow(client._id)}
                        className="text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] p-1 rounded-md transition-colors"
                      >
                        {expandedRows.has(client._id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--ink)]">{client.name}</td>
                    <td className="px-6 py-4">{client.phone}</td>
                    <td className="px-6 py-4">
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--sub)] font-medium">₹</span>
                        <input 
                          type="number" 
                          value={client.dealAmount}
                          onChange={(e) => updateClient(client._id, { dealAmount: Number(e.target.value) })}
                          className="w-full h-8 pl-6 pr-2 rounded-md border border-transparent hover:border-[var(--line)] focus:border-[var(--accent)] bg-transparent focus:bg-[var(--bg)] outline-none text-[var(--ink)]"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--sub)] font-medium">₹</span>
                        <input 
                          type="number" 
                          value={client.paid}
                          onChange={(e) => updateClient(client._id, { paid: Number(e.target.value) })}
                          className="w-full h-8 pl-6 pr-2 rounded-md border border-transparent hover:border-[var(--line)] focus:border-[var(--accent)] bg-transparent focus:bg-[var(--bg)] outline-none text-[var(--ink)]"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${client.due > 0 ? "text-red-500" : "text-emerald-500"}`}>
                        ₹{client.due}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="date" 
                        value={client.startDate ? new Date(client.startDate).toISOString().split('T')[0] : ""}
                        onChange={(e) => updateClient(client._id, { startDate: e.target.value })}
                        className="bg-transparent border border-transparent hover:border-[var(--line)] rounded-md px-2 py-1 outline-none text-xs"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="date" 
                        value={client.endDate ? new Date(client.endDate).toISOString().split('T')[0] : ""}
                        onChange={(e) => updateClient(client._id, { endDate: e.target.value || undefined })}
                        className="bg-transparent border border-transparent hover:border-[var(--line)] rounded-md px-2 py-1 outline-none text-xs"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => openEditModal(client)}
                          className="text-[var(--sub)] hover:text-[var(--accent)] transition-colors p-2 cursor-pointer"
                          title="Edit Client"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteClient(client._id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-2 cursor-pointer"
                          title="Delete Client"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(client._id) && (
                    <tr className="bg-black/[0.01] dark:bg-white/[0.01]">
                      <td colSpan={9} className="px-10 py-6 border-b border-[var(--line)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-xs font-semibold text-[var(--sub)] uppercase tracking-wider mb-2">Project Credentials</h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-[var(--sub)] font-medium">Email: </span> {client.projectEmail || <span className="text-gray-400 italic">Not provided</span>}</p>
                              <p className="text-sm"><span className="text-[var(--sub)] font-medium">Password: </span> {client.projectPassword || <span className="text-gray-400 italic">Not provided</span>}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[var(--sub)] uppercase tracking-wider mb-2">Project Links</h4>
                            {client.projectLinks && client.projectLinks.filter(l => l.trim() !== "").length > 0 ? (
                              <ul className="space-y-1.5">
                                {client.projectLinks.filter(l => l.trim() !== "").map((link, idx) => (
                                  <li key={idx}>
                                    <a 
                                      href={link.startsWith('http') ? link : `https://${link}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[var(--accent)] hover:underline text-sm flex items-center gap-1.5 break-all"
                                    >
                                      {link}
                                      <ExternalLink size={12} />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No links added</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[var(--sub)] uppercase tracking-wider mb-2">System Info</h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-[var(--sub)] font-medium">Client ID: </span> <span className="font-mono text-xs">{client._id}</span></p>
                              <p className="text-sm"><span className="text-[var(--sub)] font-medium">Added On: </span> {new Date(client.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div 
            className="bg-[var(--bg)] border-l border-[var(--line)] w-full md:w-3/4 lg:w-[750px] max-w-[100vw] h-full shadow-2xl flex flex-col transform transition-transform" 
            style={{ fontFamily: "var(--font-body)", animation: "slideInRight 0.25s ease-out forwards" }}
          >
            <style>{`
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)] bg-[var(--bg)] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  {editingId ? "Edit Client" : "Add New Client"}
                </h2>
                <p className="text-xs text-[var(--sub)] mt-0.5">Fill in the client records and details below.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <form id="add-client-form" onSubmit={handleAddClient} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
              
              {formError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
                  {formError}
                </div>
              )}

              {/* Basic Info Section */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-[var(--ink)]">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 234 567 8900"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Timeline Section */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-[var(--ink)]">Financial & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Deal Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={formData.dealAmount}
                      onChange={e => setFormData({...formData, dealAmount: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Amount Paid (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={formData.paid}
                      onChange={e => setFormData({...formData, paid: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">End Date <span className="text-[var(--sub)]/60 font-normal">(Optional for WIP)</span></label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Project Credentials Section */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-[var(--ink)]">Project Credentials & Links (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Project Email</label>
                    <input
                      type="email"
                      value={formData.projectEmail}
                      onChange={e => setFormData({...formData, projectEmail: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                      placeholder="client@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--sub)] mb-1">Project Password</label>
                    <input
                      type="text"
                      value={formData.projectPassword}
                      onChange={e => setFormData({...formData, projectPassword: e.target.value})}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                      placeholder="Password credentials"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[var(--sub)] mb-2">Project Links</label>
                  <div className="flex flex-col gap-3">
                    {formData.projectLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => handleLinkChange(index, e.target.value)}
                          className="flex-1 h-10 px-3 rounded-lg border border-[var(--line)] bg-transparent outline-none focus:border-[var(--accent)] text-sm"
                          placeholder="https://example.com or staging.example.com"
                        />
                        {formData.projectLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove Link"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="text-xs font-medium text-[var(--accent)] hover:underline self-start mt-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Another Link
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--bg)] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--sub)] hover:text-[var(--ink)] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-client-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingId ? "Save Changes" : "Save Client"}</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
