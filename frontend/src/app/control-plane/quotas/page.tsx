"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { SlidersHorizontal, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QuotasPage() {
  const { data: quotas, isLoading } = useQuery({
    queryKey: ["control-plane", "quotas", "all"],
    queryFn: controlPlaneService.getQuotas,
  });

  const quotaList = quotas || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Tenant Quotas & Daily Spend Policy</h1>
          </div>
          <p className="text-xs text-slate-400">
            Tenant daily spend limits, request rate limits, and quota enforcement policies
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-pink-400" />
            <span>Active Tenant Quota Policies ({quotaList.length})</span>
          </h3>

          <div className="space-y-3">
            {quotaList.map((q) => (
              <div key={q.quotaId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">Org #{q.organizationId} Quota Policy</div>
                  <div className="text-[10px] text-slate-500">ID: {q.quotaId}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                    <span className="text-slate-400 text-[10px]">Max Daily Spend</span>
                    <div className="text-lg font-bold text-emerald-400">${q.maxDailySpendUsd} USD</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                    <span className="text-slate-400 text-[10px]">Current Daily Spend</span>
                    <div className="text-lg font-bold text-cyan-400">${q.currentDailySpendUsd} USD</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                    <span className="text-slate-400 text-[10px]">Max Daily Requests</span>
                    <div className="text-lg font-bold text-purple-400">{q.maxDailyRequests} reqs</div>
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                    <span className="text-slate-400 text-[10px]">Current Requests</span>
                    <div className="text-lg font-bold text-amber-400">{q.currentDailyRequests} reqs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
