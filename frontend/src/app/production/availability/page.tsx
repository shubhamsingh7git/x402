"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Globe2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AvailabilityPage() {
  const { data: regions, isLoading } = useQuery({
    queryKey: ["production", "availability", "all"],
    queryFn: productionService.getAvailability,
  });

  const testFailoverMutation = useMutation({
    mutationFn: (policyId: string) => productionService.testFailover(policyId),
  });

  const regionList = regions || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Production Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Globe2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">High Availability & Multi-Region Topology</h1>
          </div>
          <p className="text-xs text-slate-400">
            Active-Active multi-region deployment topology, regional health replication, and failover policy testing
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-400" />
              <span>Active Regions ({regionList.length})</span>
            </h3>

            <button
              onClick={() => testFailoverMutation.mutate("pol_multi_region_active_active")}
              disabled={testFailoverMutation.isPending}
              className="px-3.5 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 font-sans text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Test Regional Failover</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regionList.map((r) => (
              <div key={r.regionId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{r.name}</span>
                    {r.isPrimary && (
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded font-mono">
                        Primary
                      </span>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Code: <strong className="text-cyan-400">{r.code}</strong> • Latency: <strong className="text-emerald-400">{r.latencyMs} ms</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
