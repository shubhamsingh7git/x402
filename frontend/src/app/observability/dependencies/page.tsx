"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { GitMerge, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DependenciesPage() {
  const { data: deps, isLoading } = useQuery({
    queryKey: ["observability", "dependencies", "all"],
    queryFn: observabilityService.getDependencies,
  });

  const depList = deps || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <GitMerge className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Service Dependency Graph & Inter-Service Calls</h1>
          </div>
          <p className="text-xs text-slate-400">
            Microservice dependency mapping, inter-service call volumes, and network latencies
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-pink-400" />
            <span>Dependency Edges ({depList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {depList.map((d: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold text-cyan-400">{d.source}</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-bold text-purple-400">{d.target}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Volume: <strong className="text-indigo-400">{d.callsPerMin} req/min</strong> • Latency: <strong className="text-emerald-400">{d.latencyMs}ms</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
