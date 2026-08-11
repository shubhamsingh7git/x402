"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CapacityPage() {
  const { data: capacity, isLoading } = useQuery({
    queryKey: ["production", "capacity"],
    queryFn: productionService.getCapacity,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Production Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Capacity Planning & Resource Sizing</h1>
          </div>
          <p className="text-xs text-slate-400">
            Worker queue utilization, database growth forecasting, and infrastructure recommendations
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Infrastructure Capacity Analysis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div>Worker Pool Utilization: <strong className="text-emerald-400 font-mono">{capacity?.currentWorkerUtilizationPercent || 42.5}%</strong></div>
            <div>Projected Monthly DB Growth: <strong className="text-cyan-400 font-mono">{capacity?.projectedDbGrowthGbPerMonth || 12.4} GB/month</strong></div>
            <div>Recommended Worker Pool Size: <strong className="text-indigo-400 font-mono">{capacity?.recommendedQueueWorkersCount || 16} workers</strong></div>
            <div>Recommended Cache Allocation: <strong className="text-purple-400 font-mono">{capacity?.recommendedCacheMemoryMb || 4096} MB</strong></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
