"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HeartPulse, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HealthPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ["observability", "health", "topology"],
    queryFn: observabilityService.getHealth,
  });

  const services = health?.services || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Health Monitoring & Topology</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time health status, response latencies, and circuit health across platform services
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            <span>Monitored Services ({services.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s: any) => (
              <div key={s.name} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{s.name}</div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="text-slate-400 text-xs font-mono pt-2 border-t border-slate-900">
                  Latency Probe: <strong className="text-emerald-400">{s.latencyMs}ms</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
