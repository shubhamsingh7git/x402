"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bazaarService, BazaarSearchQueryParams } from "@/lib/api/services/bazaarService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Sparkles, SlidersHorizontal, ShieldCheck, Zap, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function BazaarDiscoveryPage() {
  const [params, setParams] = useState<BazaarSearchQueryParams>({
    capability: "financial-analysis",
    sortBy: "rank",
    sortOrder: "desc",
    merchantVerifiedOnly: false,
  });

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ["bazaar", "search", params],
    queryFn: () => bazaarService.searchAndRank(params),
  });

  const { data: capabilities } = useQuery({
    queryKey: ["bazaar", "capabilities"],
    queryFn: () => bazaarService.listCapabilities(),
  });

  const capList = Array.isArray(capabilities) ? capabilities : [];
  const candidates = Array.isArray(searchResults?.candidates) ? searchResults.candidates : [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono">
        {/* Navigation */}
        <Link href={ROUTES.BAZAAR.DISCOVERY} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bazaar Overview</span>
        </Link>

        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>Interactive Candidate Discovery Sandbox</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic Weighted Scoring: Filter by capability, max price, network, and merchant verification with real-time scoring
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700/60 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Re-evaluate Ranking</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Capability</label>
            <select
              value={params.capability || ""}
              onChange={(e) => setParams((p) => ({ ...p, capability: e.target.value || undefined }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="">All Capabilities</option>
              {capList.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Ranking Algorithm Sort</label>
            <select
              value={params.sortBy || "rank"}
              onChange={(e) => setParams((p) => ({ ...p, sortBy: e.target.value as any }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="rank">Composite Score (Highest First)</option>
              <option value="latency">Latency SLA (Lowest First)</option>
              <option value="price">Price per Call (Lowest First)</option>
              <option value="trust">Merchant Trust Score</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Max Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 0.10"
              value={params.maxPrice || ""}
              onChange={(e) => setParams((p) => ({ ...p, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2 text-slate-300">
              <input
                type="checkbox"
                checked={!!params.merchantVerifiedOnly}
                onChange={(e) => setParams((p) => ({ ...p, merchantVerifiedOnly: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
              <span>Verified Merchants Only</span>
            </label>
          </div>
        </div>

        {/* Discovery Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Discovered <strong className="text-white">{candidates.length}</strong> candidate provider(s)
            </span>
          </div>

          {isLoading ? (
            <LoadingSkeleton rows={4} />
          ) : candidates.length > 0 ? (
            candidates.map((candidate, idx) => (
              <div
                key={candidate.listing._id || idx}
                className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-lg">
                      Rank #{idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm">{candidate.merchant.alias}</span>
                    <StatusBadge status={candidate.listing.status} />
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Provider ID: <strong className="text-white">{candidate.listing.providerId}</strong></span>
                    <span>•</span>
                    <span>Wallet: <strong className="text-slate-300">{candidate.merchant.walletAddress || "N/A"}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {candidate.listing.capabilities.map((c) => (
                      <span key={c} className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase">Composite Score</div>
                    <div className="text-cyan-400 font-bold text-base">{candidate.metrics.compositeScore}/100</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px] uppercase">Latency</div>
                    <div className="text-purple-400 font-bold">{candidate.metrics.latencyMs} ms</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[10px] uppercase">Price/Call</div>
                    <div className="text-emerald-400 font-bold">${candidate.listing.pricePerCall}</div>
                  </div>

                  <Link
                    href={`/bazaar/providers/${candidate.listing._id}`}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700/60"
                  >
                    Select
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
              No candidate providers match the specified discovery filters. Try selecting another capability or increasing max price.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
