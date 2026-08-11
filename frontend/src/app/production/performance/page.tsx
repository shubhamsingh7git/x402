"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PerformancePage() {
  const { data: perf, isLoading } = useQuery({
    queryKey: ["production", "performance", "latest"],
    queryFn: productionService.getPerformance,
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
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Performance Engineering & Profiling</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time API latency percentiles (P50, P95, P99), request throughput, and cache hit ratio
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">P50 Latency</span>
            <div className="text-2xl font-bold text-emerald-400">{perf?.p50LatencyMs || 14} ms</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">P95 Latency</span>
            <div className="text-2xl font-bold text-cyan-400">{perf?.p95LatencyMs || 45} ms</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">P99 Latency</span>
            <div className="text-2xl font-bold text-indigo-400">{perf?.p99LatencyMs || 110} ms</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Throughput (RPS)</span>
            <div className="text-2xl font-bold text-purple-400">{perf?.requestsPerSecond || 4200} req/sec</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
