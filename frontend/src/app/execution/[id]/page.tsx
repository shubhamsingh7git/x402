"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { executionService } from "@/lib/api/services/executionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import { Cpu, ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Zap, RefreshCcw, Layers, Activity } from "lucide-react";
import Link from "next/link";

export default function ExecutionSessionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [jsonOpen, setJsonOpen] = useState(false);

  const { data: session, isLoading, isError, refetch } = useQuery({
    queryKey: ["execution", "session", id],
    queryFn: () => executionService.getSessionById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton rows={6} />
      </AppLayout>
    );
  }

  if (isError || !session) {
    return (
      <AppLayout>
        <ErrorState title="Session Not Found" message="Could not load execution session details" onRetry={refetch} />
      </AppLayout>
    );
  }

  const statesSequence = ["CREATED", "DISCOVERING", "RANKING", "EXECUTING", "CONSENSUS", "PAYMENT", "COMPLETED"];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href="/execution" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Execution Overview</span>
        </Link>

        {/* Hero Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Session #{session.sessionId}</h1>
              <StatusBadge status={session.state} />
            </div>
            <p className="text-xs text-slate-400">
              Target Capability: <span className="text-white font-bold">{session.capability}</span> • Strategy: <span className="text-purple-400 font-bold">{session.strategy}</span>
            </p>
          </div>

          <button
            onClick={() => setJsonOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700/60 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Raw JSON Payload</span>
          </button>
        </div>

        {/* State Machine Visualization */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>State Machine Execution Lifecycle</span>
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
            {statesSequence.map((st, idx) => {
              const isCurrent = session.state === st;
              const isPassed = session.success || statesSequence.indexOf(session.state) > idx;

              return (
                <React.Fragment key={st}>
                  {idx > 0 && <div className="w-6 h-0.5 bg-slate-800 shrink-0" />}
                  <div
                    className={`px-3 py-1.5 rounded-xl border shrink-0 flex items-center gap-1.5 ${
                      isCurrent
                        ? "bg-purple-500/20 border-purple-500 text-purple-300 font-bold"
                        : isPassed
                        ? "bg-slate-900 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-500"
                    }`}
                  >
                    <span className="text-[10px]">{idx + 1}.</span>
                    <span>{st}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Session Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Total Execution Duration</span>
            <div className="text-2xl font-bold text-purple-400">{session.totalDurationMs} ms</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Total Micro-Payment Cost</span>
            <div className="text-2xl font-bold text-emerald-400">${session.totalCostUsd} USD</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Total Provider Attempts</span>
            <div className="text-2xl font-bold text-cyan-400">{(session.attempts || []).length} attempt(s)</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Failover Triggered</span>
            <div className={`text-2xl font-bold ${session.fallbackTriggered ? "text-amber-400" : "text-slate-400"}`}>
              {session.fallbackTriggered ? `YES (${session.fallbackCount} fallback)` : "NO"}
            </div>
          </div>
        </div>

        {/* Detailed Attempts Log */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Provider Execution Attempts & Failover Log</span>
          </h3>

          <div className="space-y-3">
            {(session.attempts || []).map((att, idx) => (
              <div key={att.attemptId || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono">
                        Attempt #{idx + 1}
                      </span>
                      <span className="font-bold text-white">{att.merchantAlias}</span>
                      <StatusBadge status={att.status} />
                    </div>
                    <div className="text-[10px] text-slate-400">Provider ID: {att.providerId} • TxHash: {att.txHash || "N/A"}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-purple-400 font-bold">{att.durationMs} ms</div>
                    <div className="text-emerald-400">${att.costUsd} USD</div>
                  </div>
                </div>

                {att.output && (
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 text-[11px]">
                    <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Output Result:</div>
                    <pre className="text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">{JSON.stringify(att.output, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* JSON Inspector */}
        <JsonInspectorModal isOpen={jsonOpen} onClose={() => setJsonOpen(false)} title={`Execution Session #${session.sessionId}`} data={session} />
      </div>
    </AppLayout>
  );
}
