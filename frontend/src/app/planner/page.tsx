"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { plannerService } from "@/lib/api/services/plannerService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlannerExecutionPlan } from "@/types";
import {
  Sparkles,
  Search,
  Layers,
  Building2,
  Zap,
  ShieldCheck,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlannerSandboxPage() {
  const [prompt, setPrompt] = useState("Perform deep web search and financial analysis for AAPL stock");
  const [executionPlan, setExecutionPlan] = useState<PlannerExecutionPlan | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: plannerService.analyzeAndPlan,
    onSuccess: (data) => {
      setExecutionPlan(data);
    },
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      analyzeMutation.mutate(prompt);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>AI Planner Sandbox & Discovery Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic capability reasoning, Bazaar provider discovery, weighted strategy scoring, and explainable execution plans
            </p>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs rounded-xl font-bold">
            Milestone 5.2 Dynamic Planner Active
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
          <label className="block text-sm font-bold text-white font-sans">Enter Research Prompt for Dynamic Provider Discovery</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Perform web search and financial analysis for TSLA"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-sans"
            />
            <Button
              type="submit"
              disabled={analyzeMutation.isPending || !prompt.trim()}
              variant="default"
              size="lg"
              className="gap-2 font-mono shrink-0"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Discovering Providers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Plan & Resolve Providers</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Execution Plan Output */}
        {analyzeMutation.isPending ? (
          <LoadingSkeleton rows={5} />
        ) : executionPlan ? (
          <div className="space-y-6">
            {/* Plan Overview Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-slate-400 text-[11px]">Execution Plan Status</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={executionPlan.status === "RESOLVED" ? "ACTIVE" : "MAINTENANCE"} />
                  <span className="text-white font-bold text-sm">{executionPlan.status}</span>
                </div>
                <div className="text-[11px] text-slate-500">Plan ID: {executionPlan.planId}</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-slate-400 text-[11px]">Extracted Capabilities</span>
                <div className="text-2xl font-bold text-cyan-400">{executionPlan.capabilities?.length ?? 0}</div>
                <div className="text-[11px] text-slate-500">Reasoned without concrete provider assumptions</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-slate-400 text-[11px]">Average Planner Confidence</span>
                <div className="text-2xl font-bold text-emerald-400">{executionPlan.summary?.averageConfidenceScore ?? 0}%</div>
                <div className="text-[11px] text-slate-500">DefaultBalanced Strategy Weight</div>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-slate-400 text-[11px]">Estimated Micro-Payment</span>
                <div className="text-2xl font-bold text-purple-400 font-mono">
                  ${Number(executionPlan.summary?.estimatedCostUsd ?? 0).toFixed(4)} USD
                </div>
                <div className="text-[11px] text-slate-500">Settled via x402 PaymentManager</div>
              </div>
            </div>

            {/* Extracted Capabilities Section */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. Extracted Abstract Capabilities</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {executionPlan.capabilities?.map((c) => (
                  <div key={c.name} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-white text-xs">{c.displayName}</div>
                    <div className="text-[10px] text-cyan-400">Canonical: {c.name}</div>
                    <div className="text-[10px] text-slate-400">Category: {c.category} • Complexity: {c.estimatedComplexity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Providers & Explainability */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>2. Bazaar Discovery & Explainable Provider Selection</span>
              </h3>

              <div className="space-y-4">
                {executionPlan.steps?.map((step) => (
                  <div key={step.stepId} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold rounded">
                            Step #{step.stepId}
                          </span>
                          <span className="font-bold text-white text-sm">{step.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Capability: <strong className="text-cyan-400">{step.capability}</strong></div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">Planner Score</div>
                        <div className="text-emerald-400 font-bold text-base">{step.explanation?.plannerScore}/100</div>
                      </div>
                    </div>

                    {/* Selected Provider Spec */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                      <div>
                        <span className="text-slate-500">Selected Provider</span>
                        <div className="font-bold text-white">{step.provider.merchantAlias}</div>
                        <div className="text-[10px] text-slate-400">ID: {step.provider.providerId}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Rate Structure</span>
                        <div className="font-bold text-emerald-400">${step.provider.pricePerCall} USD/call</div>
                        <div className="text-[10px] text-slate-400">Networks: {(step.provider.supportedNetworks || []).join(", ")}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Verification & Trust</span>
                        <div className="font-bold text-cyan-400">{step.provider.isVerified ? "Verified Merchant" : "Pending Verification"}</div>
                        <div className="text-[10px] text-slate-400">Trust Score: {step.provider.trustScore}%</div>
                      </div>
                    </div>

                    {/* Explainability Card */}
                    <div className="p-3 bg-slate-900/80 border border-cyan-500/30 rounded-lg text-slate-300 text-xs flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-400 text-[11px]">Selection Explanation:</div>
                        <p className="text-[11px] leading-relaxed text-slate-300">{step.explanation?.selectionReason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unresolved Capabilities (Graceful Resilience) */}
            {executionPlan.unresolvedCapabilities && executionPlan.unresolvedCapabilities.length > 0 && (
              <div className="p-6 bg-amber-950/20 border border-amber-500/40 rounded-2xl space-y-3">
                <h3 className="font-bold text-amber-400 text-sm font-sans flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unresolved Capabilities (Zero Matching Providers)</span>
                </h3>
                <div className="space-y-2">
                  {executionPlan.unresolvedCapabilities.map((u) => (
                    <div key={u.capability} className="p-3 bg-slate-950 border border-amber-800/40 rounded-xl space-y-1">
                      <div className="font-bold text-white">Capability: {u.capability}</div>
                      <p className="text-slate-400">{u.reason}</p>
                      {u.suggestedAlternatives && (
                        <div className="text-[10px] text-amber-300 font-mono pt-1">
                          Suggested Alternatives: {u.suggestedAlternatives.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500">
            Submit a research prompt above to run capability reasoning, Bazaar provider discovery, and explainable planning.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
