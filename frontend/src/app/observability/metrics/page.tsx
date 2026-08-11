"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Gauge, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MetricsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["observability", "metrics", "all"],
    queryFn: observabilityService.getMetrics,
  });

  const metricList = metrics || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Metrics Aggregator & Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            Continuous time-series metrics collection across all platform microservices
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span>Time-Series Metrics Journal ({metricList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricList.map((m) => (
              <div key={m.metricName} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{m.metricName}</div>
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                    {m.metricType}
                  </span>
                </div>
                <div className="text-slate-400 text-xs font-mono pt-1">
                  Value: <strong className="text-cyan-400">{m.value}</strong> • Service: <strong className="text-emerald-400">{m.serviceName}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
