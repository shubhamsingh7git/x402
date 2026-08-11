"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { bazaarService } from "@/lib/api/services/bazaarService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Layers, Plus, Tag, ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function BazaarCapabilitiesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Form State
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("ai, taxonomy, dataset");

  const { data: capabilities, isLoading, refetch } = useQuery({
    queryKey: ["bazaar", "capabilities", selectedCategory],
    queryFn: () => bazaarService.listCapabilities(selectedCategory),
  });

  const createCapMutation = useMutation({
    mutationFn: bazaarService.createCapability,
    onSuccess: () => {
      setIsOpen(false);
      setName("");
      setDisplayName("");
      refetch();
    },
  });

  const capList = Array.isArray(capabilities) ? capabilities : [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href={ROUTES.BAZAAR.DISCOVERY} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bazaar Overview</span>
        </Link>

        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>Capability Taxonomy Catalog</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Standardized platform capabilities taxonomy: Canonical names, categories, tag indexing, and deprecation states
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Capability</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["ALL", "FINANCE", "DATA", "AI", "UTILITY", "SECURITY", "ANALYTICS"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "ALL" ? undefined : cat)}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                (cat === "ALL" && !selectedCategory) || selectedCategory === cat
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Capability Cards Grid */}
        {isLoading ? (
          <LoadingSkeleton rows={4} />
        ) : capList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capList.map((cap) => (
              <div
                key={cap._id}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 text-[10px] font-bold rounded">
                      {cap.category}
                    </span>
                    <StatusBadge status={cap.status || "ACTIVE"} />
                  </div>

                  <h3 className="font-bold text-white text-sm font-sans">{cap.displayName}</h3>
                  <div className="text-[11px] text-cyan-400 font-mono">ID: {cap.name}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{cap.description || "No description provided."}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Version v{cap.version || "1.0.0"}</span>
                  <div className="flex items-center gap-1">
                    {(cap.tags || []).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500">
            No capabilities cataloged for the selected category.
          </div>
        )}

        {/* Modal - Create Capability */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-400" />
                <span>Register Canonical Capability</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Canonical ID Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. market-data"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Live Market Data Feed"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="FINANCE">FINANCE</option>
                    <option value="DATA">DATA</option>
                    <option value="AI">AI</option>
                    <option value="UTILITY">UTILITY</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="ANALYTICS">ANALYTICS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe capability capabilities..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button
                  onClick={() =>
                    createCapMutation.mutate({
                      name,
                      displayName,
                      category,
                      description,
                      tags: tags.split(",").map((s) => s.trim()),
                    })
                  }
                  disabled={!name || !displayName || createCapMutation.isPending}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl disabled:opacity-50"
                >
                  {createCapMutation.isPending ? "Creating..." : "Save Capability"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
