"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Flame, ArrowLeft, Play } from "lucide-react";
import Link from "next/link";

export default function ChaosPage() {
  const { data: experiments, isLoading, refetch } = useQuery({
    queryKey: ["production", "chaos", "all"],
    queryFn: productionService.getChaos,
  });

  const runChaosMutation = useMutation({
    mutationFn: (experimentId: string) => productionService.runChaos(experimentId),
    onSuccess: () => refetch(),
  });

  const expList = experiments || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Production Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Chaos Engineering & Fault Injection Experiments</h1>
          </div>
          <p className="text-xs text-slate-400">
            Controlled resilience simulations (service outage, latency injection, DB network partition) with automated recovery score evaluation
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Chaos Experiments ({expList.length})</span>
          </h3>

          <div className="space-y-3">
            {expList.map((e) => (
              <div key={e.experimentId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{e.title}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded font-mono">
                      Fault: {e.faultType}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Target Service: {e.targetService} • Resilience Score: {e.resilienceScorePercent}%</div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={e.status} />
                  <button
                    onClick={() => runChaosMutation.mutate(e.experimentId)}
                    disabled={runChaosMutation.isPending}
                    className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Inject Fault</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
