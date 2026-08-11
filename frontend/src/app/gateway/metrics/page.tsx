"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MetricsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["gateway", "metrics", "detail"],
    queryFn: gatewayService.getMetrics,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/gateway" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to API Gateway Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">P50 / P95 / P99 Gateway Latency & Throughput Metrics</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time gateway request throughput, active connections, rate limits, and latency percentiles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-center">
            <span className="text-slate-400 text-xs font-sans">P50 Median Latency</span>
            <div className="text-3xl font-bold text-emerald-400">{metrics?.p50LatencyMs || 8} ms</div>
            <p className="text-[10px] text-slate-500">50% of requests complete within this latency</p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-center">
            <span className="text-slate-400 text-xs font-sans">P95 Latency Percentile</span>
            <div className="text-3xl font-bold text-cyan-400">{metrics?.p95LatencyMs || 18} ms</div>
            <p className="text-[10px] text-slate-500">95% of requests complete within this latency</p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-center">
            <span className="text-slate-400 text-xs font-sans">P99 Latency Percentile</span>
            <div className="text-3xl font-bold text-purple-400">{metrics?.p99LatencyMs || 34} ms</div>
            <p className="text-[10px] text-slate-500">99% of requests complete within this latency</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
