"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, ArrowLeft, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { GovernanceEvaluationRecord } from "@/types";

export default function GovernanceConsolePage() {
  const [capability, setCapability] = useState("financial-analysis");
  const [evaluation, setEvaluation] = useState<GovernanceEvaluationRecord | null>(null);

  const evalMutation = useMutation({
    mutationFn: agentService.evaluateGovernance,
    onSuccess: (data) => setEvaluation(data),
  });

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    evalMutation.mutate(capability);
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/agents" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Governance & Risk Evaluation Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Pre-execution policy constraint evaluation, risk score calculation, and human approval enforcement
          </p>
        </div>

        <form onSubmit={handleEvaluate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Evaluate Task Capability Governance</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="e.g. payment-transfer, financial-analysis"
              value={capability}
              onChange={(e) => setCapability(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
            <button
              type="submit"
              disabled={evalMutation.isPending}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Evaluate Governance
            </button>
          </div>
        </form>

        {evaluation && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm font-sans">Governance Evaluation Result</h3>
              <span className={`px-3 py-1 font-bold text-xs rounded-xl ${evaluation.allowed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                {evaluation.allowed ? "ALLOWED" : "DENIED"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Risk Score</span>
                <div className="text-2xl font-bold text-amber-400">{evaluation.riskScore} / 100</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Human Approval Required</span>
                <div className={`text-2xl font-bold ${evaluation.requiresApproval ? "text-amber-400" : "text-emerald-400"}`}>
                  {evaluation.requiresApproval ? "YES" : "NO"}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Max Allowed Budget</span>
                <div className="text-2xl font-bold text-cyan-400">${evaluation.maxAllowedSpendUsd} USD</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
