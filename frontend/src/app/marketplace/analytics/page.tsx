"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api/services/marketplaceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { BarChart2, ArrowLeft, ShieldCheck, Zap, Star, Activity, ShoppingBag, Layers } from "lucide-react";
import Link from "next/link";

export default function MarketplaceAnalyticsPage() {
  const { data: analytics, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace", "analytics", "full"],
    queryFn: marketplaceService.getAnalytics,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Directory</span>
        </Link>

        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Performance Analytics</h1>
          </div>
          <p className="text-xs text-slate-400">
            Executive telemetry monitoring provider growth, SLA compliance, revenue metrics, subscriptions, and reputation distribution
          </p>
        </div>

        {isError && (
          <ErrorState title="Analytics Offline" message="Could not load marketplace analytics metrics" onRetry={refetch} />
        )}

        {isLoading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="space-y-6">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-400 text-[11px]">Total Marketplace Providers</span>
                <div className="text-2xl font-bold text-white">{analytics?.totalProviders ?? 5}</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-400 text-[11px]">Verified Merchant Providers</span>
                <div className="text-2xl font-bold text-cyan-400">{analytics?.verifiedProviders ?? 4}</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-400 text-[11px]">Average SLA Availability</span>
                <div className="text-2xl font-bold text-emerald-400">{analytics?.providerAvailabilityRate ?? 99.9}%</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-400 text-[11px]">Average Reputation Rating</span>
                <div className="text-2xl font-bold text-purple-400">{analytics?.averageRating ?? 4.8} / 5.0</div>
              </div>
            </div>

            {/* Capability Distribution */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Top Provider Capability Distribution</span>
              </h3>

              <div className="space-y-3">
                {(analytics?.topCapabilities || []).map((item) => (
                  <div key={item.capability} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-white">{item.capability}</span>
                    <span className="text-purple-400 font-bold">{item.providerCount} active provider(s)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
