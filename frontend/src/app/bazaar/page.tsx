"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { bazaarService } from "@/lib/api/services/bazaarService";
import { merchantService } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Store,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Tag,
  ArrowRight,
  Sparkles,
  Building2,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function BazaarOverviewPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCapabilityOpen, setIsCapabilityOpen] = useState(false);

  // Form State - Provider Registration
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [selectedCaps, setSelectedCaps] = useState<string[]>(["financial-analysis"]);
  const [pricePerCall, setPricePerCall] = useState(0.02);
  const [network, setNetwork] = useState("Base Sepolia Testnet");

  // Form State - Capability Registration
  const [capName, setCapName] = useState("");
  const [capDisplayName, setCapDisplayName] = useState("");
  const [capCategory, setCapCategory] = useState("FINANCE");
  const [capDescription, setCapDescription] = useState("");

  const { data: metrics, isLoading: isLoadingMetrics, isError: isErrorMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ["bazaar", "overview"],
    queryFn: bazaarService.getOverviewMetrics,
  });

  const { data: capabilities, isLoading: isLoadingCaps } = useQuery({
    queryKey: ["bazaar", "capabilities"],
    queryFn: () => bazaarService.listCapabilities(),
  });

  const { data: rankedSearch, isLoading: isLoadingRanked } = useQuery({
    queryKey: ["bazaar", "top-ranked"],
    queryFn: () => bazaarService.searchAndRank({ limit: 5 }),
  });

  const { data: merchantsData } = useQuery({
    queryKey: ["merchants", "select"],
    queryFn: () => merchantService.listMerchants({ limit: 100 }),
  });

  const registerProviderMutation = useMutation({
    mutationFn: bazaarService.createProvider,
    onSuccess: () => {
      setIsRegisterOpen(false);
      refetchMetrics();
    },
  });

  const registerCapMutation = useMutation({
    mutationFn: bazaarService.createCapability,
    onSuccess: () => {
      setIsCapabilityOpen(false);
      refetchMetrics();
    },
  });

  const merchantsList = Array.isArray(merchantsData?.data) ? merchantsData.data : [];
  const capList = Array.isArray(capabilities) ? capabilities : [];
  const topCandidates = Array.isArray(rankedSearch?.candidates) ? rankedSearch.candidates : [];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-cyan-400" />
              <span>x402 Service Bazaar & Discovery Engine</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Enterprise Service Discovery: Dynamic capability indexing, weighted provider ranking, SLA telemetry, and autonomous resolution
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCapabilityOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl border border-slate-700/60 flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>New Capability</span>
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Provider</span>
            </button>
          </div>
        </div>

        {isErrorMetrics && (
          <ErrorState
            title="Bazaar Telemetry Offline"
            message="Could not load Bazaar overview metrics from backend REST API"
            onRetry={refetchMetrics}
          />
        )}

        {/* Executive Metric Cards */}
        {isLoadingMetrics ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Provider Listings</span>
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{metrics?.totalProviders ?? 0}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">{metrics?.healthyProviders ?? 0} Healthy</span>
                <span>•</span>
                <span className="text-slate-500">{metrics?.offlineProviders ?? 0} Offline</span>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Platform Capabilities</span>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{metrics?.activeCapabilities ?? 0}</div>
              <div className="text-[11px] text-slate-400">Canonical taxonomy index</div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Average SLA Latency</span>
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{metrics?.averageLatencyMs ?? 0} ms</div>
              <div className="text-[11px] text-slate-400">Sub-second execution target</div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Average Trust Score</span>
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{metrics?.averageTrustScore ?? 98.0}/100</div>
              <div className="text-[11px] text-emerald-400 font-bold">100% Strategy Verified</div>
            </div>
          </div>
        )}

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={ROUTES.BAZAAR.PROVIDERS}
            className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl backdrop-blur-md space-y-3 group transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Store className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">Provider Registry Directory</h3>
              <p className="text-xs text-slate-400 mt-1">Browse, filter, and inspect registered x402 capability providers</p>
            </div>
          </Link>

          <Link
            href="/bazaar/discovery"
            className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl backdrop-blur-md space-y-3 group transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">Discovery & Ranking Sandbox</h3>
              <p className="text-xs text-slate-400 mt-1">Test candidate search and dynamic composite ranking algorithms</p>
            </div>
          </Link>

          <Link
            href="/bazaar/capabilities"
            className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl backdrop-blur-md space-y-3 group transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">Capability Taxonomy Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">Manage standardized AI, Finance, and Data capabilities</p>
            </div>
          </Link>
        </div>

        {/* Top Ranked Candidates Section */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Top-Ranked Provider Candidates (Dynamic Scoring)</span>
            </h3>
            <Link href="/bazaar/discovery" className="text-xs text-cyan-400 hover:underline">
              Run Full Search →
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingRanked ? (
              <LoadingSkeleton rows={3} />
            ) : topCandidates.length > 0 ? (
              topCandidates.map((candidate, idx) => (
                <div
                  key={candidate.listing._id || idx}
                  className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{candidate.merchant.alias}</span>
                      <StatusBadge status={candidate.listing.status} />
                      {candidate.merchant.isVerified && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-full">
                          Verified Merchant
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>ID: {candidate.listing.providerId}</span>
                      <span>•</span>
                      <span>Rate: ${candidate.listing.pricePerCall} USD/call</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {candidate.listing.capabilities.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-right shrink-0">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Composite Score</div>
                      <div className="text-cyan-400 font-bold text-sm">{candidate.metrics.compositeScore}/100</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Latency</div>
                      <div className="text-purple-400 font-bold">{candidate.metrics.latencyMs} ms</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Trust Score</div>
                      <div className="text-emerald-400 font-bold">{candidate.metrics.trustScore}%</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">No provider listings currently active in Bazaar</div>
            )}
          </div>
        </div>

        {/* Modal - Register Provider */}
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in font-mono text-xs">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Store className="w-5 h-5 text-cyan-400" />
                <span>Register Provider Listing</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Merchant Provider *</label>
                  <select
                    value={selectedMerchant}
                    onChange={(e) => setSelectedMerchant(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">-- Select Merchant --</option>
                    {merchantsList.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.alias} ({m.network})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Capability *</label>
                  <select
                    value={selectedCaps[0] || ""}
                    onChange={(e) => setSelectedCaps([e.target.value])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {capList.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.displayName} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price per Call ($ USD)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={pricePerCall}
                    onChange={(e) => setPricePerCall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supported Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Base Sepolia Testnet">Base Sepolia Testnet</option>
                    <option value="Algorand TestNet">Algorand TestNet</option>
                    <option value="Solana Devnet">Solana Devnet</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button
                  onClick={() =>
                    registerProviderMutation.mutate({
                      merchantId: selectedMerchant,
                      capabilities: selectedCaps,
                      pricePerCall,
                      supportedNetworks: [network],
                    })
                  }
                  disabled={!selectedMerchant || selectedCaps.length === 0 || registerProviderMutation.isPending}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl disabled:opacity-50"
                >
                  {registerProviderMutation.isPending ? "Registering..." : "Register Provider"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal - Register Capability */}
        {isCapabilityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in font-mono text-xs">
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
                    value={capName}
                    onChange={(e) => setCapName(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. sentiment-analysis"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={capDisplayName}
                    onChange={(e) => setCapDisplayName(e.target.value)}
                    placeholder="e.g. Sentiment Analysis Engine"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={capCategory}
                    onChange={(e) => setCapCategory(e.target.value)}
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
                    value={capDescription}
                    onChange={(e) => setCapDescription(e.target.value)}
                    placeholder="Describe capability capabilities..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button onClick={() => setIsCapabilityOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                  Cancel
                </button>
                <button
                  onClick={() =>
                    registerCapMutation.mutate({
                      name: capName,
                      displayName: capDisplayName,
                      category: capCategory,
                      description: capDescription,
                    })
                  }
                  disabled={!capName || !capDisplayName || registerCapMutation.isPending}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl disabled:opacity-50"
                >
                  {registerCapMutation.isPending ? "Creating..." : "Save Capability"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
