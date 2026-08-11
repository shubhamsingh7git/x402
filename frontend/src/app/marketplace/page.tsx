"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api/services/marketplaceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProviderProfileRecord } from "@/types";
import {
  ShoppingBag,
  Search,
  Star,
  ShieldCheck,
  Zap,
  PlusCircle,
  BarChart2,
  MessageSquare,
  Award,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketplaceDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: analytics } = useQuery({
    queryKey: ["marketplace", "analytics"],
    queryFn: marketplaceService.getAnalytics,
  });

  const { data: providersData, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace", "providers", searchQuery, selectedCategory],
    queryFn: () => marketplaceService.searchProviders({ q: searchQuery, category: selectedCategory }),
  });

  const providers = providersData?.items || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Hero Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
              <span>Enterprise AI Service Marketplace</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Discover, onboard, and orchestrate verified AI service providers with dynamic SLA guarantees and automated reputation scoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2 font-mono">
              <Link href="/marketplace/analytics">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="gap-2 font-mono">
              <Link href="/marketplace/onboarding">
                <PlusCircle className="w-4 h-4" />
                <span>Provider Onboarding</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Total Marketplace Providers</span>
            <div className="text-2xl font-bold text-white">{analytics?.totalProviders ?? 5} <span className="text-emerald-400 text-sm">({analytics?.activeProviders ?? 4} Active)</span></div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Average Provider SLA</span>
            <div className="text-2xl font-bold text-emerald-400">{analytics?.providerAvailabilityRate ?? 99.9}%</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Average Reputation Score</span>
            <div className="text-2xl font-bold text-purple-400">{analytics?.averageRating ?? 4.8} / 5.0</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Total Community Reviews</span>
            <div className="text-2xl font-bold text-cyan-400">{analytics?.reviewCount ?? 342} reviews</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search providers by capability, name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            >
              <option value="">All Categories</option>
              <option value="Analytics & Finance">Analytics & Finance</option>
              <option value="Web & Search">Web & Search</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>
        </div>

        {/* Provider Cards Grid */}
        {isError ? (
          <ErrorState title="Marketplace Offline" message="Could not load marketplace provider directory" onRetry={refetch} />
        ) : isLoading ? (
          <LoadingSkeleton rows={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((p) => (
              <div
                key={p.providerId}
                className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base font-sans">{p.displayName}</h3>
                        {p.businessVerified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{p.merchantAlias} • Category: <strong className="text-slate-200">{p.category}</strong></div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  <p className="text-slate-300 text-xs font-sans line-clamp-2">{p.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(p.capabilities || []).map((cap) => (
                      <span key={cap} className="px-2 py-0.5 bg-slate-800 text-cyan-400 rounded text-[10px] font-mono border border-slate-700/60">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.reputationScore} / 100</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="text-emerald-400 font-bold">$0.02 / call</div>
                  </div>

                  <Link
                    href={`/marketplace/providers/${p.providerId}`}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
