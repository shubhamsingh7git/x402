"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { intelligenceService } from "@/lib/api/services/intelligenceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RecommendationsConsolePage() {
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["intelligence", "recommendations", "all"],
    queryFn: intelligenceService.getRecommendations,
  });

  const applyMutation = useMutation({
    mutationFn: (id: string) => intelligenceService.applyRecommendation(id),
    onSuccess: () => refetch(),
  });

  const recList = recommendations || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/intelligence" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Intelligence Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Categorized Optimization Recommendations Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Actionable optimization recommendations across Operational, Cost, Quality, Security, and Governance categories requiring explicit approval
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Optimization Proposals Feed ({recList.length})</span>
          </h3>

          <div className="space-y-3">
            {recList.map((rec) => (
              <div key={rec.recommendationId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{rec.title}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                      Category: {rec.category}
                    </span>
                    <StatusBadge status={rec.status} />
                  </div>
                  <p className="text-slate-400 text-xs font-sans">{rec.description}</p>
                  <div className="text-[10px] text-slate-500">ID: {rec.recommendationId} • Impact Score: {rec.impactScore}/100</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {rec.estimatedSavingsUsd && (
                    <div className="font-bold text-emerald-400 text-xs font-mono">
                      +${rec.estimatedSavingsUsd} USD
                    </div>
                  )}

                  {rec.status !== "APPLIED" && (
                    <button
                      onClick={() => applyMutation.mutate(rec.recommendationId)}
                      disabled={applyMutation.isPending}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Apply Recommendation</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
