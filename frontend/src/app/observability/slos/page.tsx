"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SlosPage() {
  const { data: slos, isLoading } = useQuery({
    queryKey: ["observability", "slos", "all"],
    queryFn: observabilityService.getSlos,
  });

  const sloList = slos || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">SLO / SLA & Error Budget Monitoring</h1>
          </div>
          <p className="text-xs text-slate-400">
            Service level objectives, remaining error budgets, availability targets, and mean time to recovery (MTTR)
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Service Level Objectives ({sloList.length})</span>
          </h3>

          <div className="space-y-3">
            {sloList.map((s) => (
              <div key={s.serviceName} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{s.serviceName}</div>
                  <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 font-bold text-[10px] rounded">
                    SLO Target: {s.sloTargetPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900 text-[11px]">
                  <div>Current Availability: <strong className="text-emerald-400">{s.currentAvailabilityPercent}%</strong></div>
                  <div>Error Budget Remaining: <strong className="text-cyan-400">{s.errorBudgetRemainingPercent}%</strong></div>
                  <div>MTTR: <strong className="text-purple-400">{s.mttrMinutes} mins</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
