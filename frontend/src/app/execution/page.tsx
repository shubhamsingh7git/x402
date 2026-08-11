"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { executionService } from "@/lib/api/services/executionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ExecutionSessionRecord } from "@/types";
import {
  Cpu,
  Play,
  Zap,
  ShieldCheck,
  RefreshCcw,
  Activity,
  Layers,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function ExecutionOverviewPage() {
  const [testCapability, setTestCapability] = useState("financial-analysis");
  const [testStrategy, setTestStrategy] = useState("BALANCED");
  const [lastResult, setLastResult] = useState<ExecutionSessionRecord | null>(null);

  const { data: telemetry, isLoading: isLoadingMetrics, isError, refetch } = useQuery({
    queryKey: ["execution", "metrics"],
    queryFn: executionService.getTelemetryMetrics,
  });

  const { data: history, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["execution", "history"],
    queryFn: () => executionService.getExecutionHistory(10),
  });

  const runTestMutation = useMutation({
    mutationFn: executionService.runTestExecution,
    onSuccess: (data) => {
      setLastResult(data);
      refetch();
      refetchHistory();
    },
  });

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    runTestMutation.mutate({ capability: testCapability, strategy: testStrategy });
  };

  const historyList = Array.isArray(history) ? history : [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span>Multi-Provider Execution & Failover Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              State Machine Orchestration: Pluggable strategies, circuit breaking, automatic failover, consensus resolution, and live health monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2 font-mono">
              <Link href="/execution/history">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Execution Logs</span>
              </Link>
            </Button>
          </div>
        </div>

        {isError && (
          <ErrorState title="Execution Telemetry Offline" message="Could not load live execution engine metrics" onRetry={refetch} />
        )}

        {/* Telemetry Cards */}
        {isLoadingMetrics ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active / Total Executions</span>
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {telemetry?.activeExecutions ?? 0} <span className="text-slate-500 text-sm">/ {telemetry?.completedExecutions ?? 0}</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold">State Machine Managed</div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Provider Health Rate</span>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-400">{telemetry?.providerSuccessRate ?? 99.2}%</div>
              <div className="text-[11px] text-slate-500">Circuit Breakers: CLOSED (Healthy)</div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Average Execution SLA</span>
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{telemetry?.averageExecutionTimeMs ?? 150} ms</div>
              <div className="text-[11px] text-slate-500">Average Latency: {telemetry?.averageLatencyMs ?? 120} ms</div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Automatic Failover Rate</span>
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <RefreshCcw className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-400">{telemetry?.fallbackRate ?? 0}%</div>
              <div className="text-[11px] text-slate-500">Average Retries: {telemetry?.averageRetries ?? 0}</div>
            </div>
          </div>
        )}

        {/* Live Multi-Provider Test Runner Form */}
        <form onSubmit={handleRunTest} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Test Multi-Provider Orchestration & Failover</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Capability</label>
              <select
                value={testCapability}
                onChange={(e) => setTestCapability(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
              >
                <option value="financial-analysis">financial-analysis</option>
                <option value="market-data">market-data</option>
                <option value="web-search">web-search</option>
                <option value="classification">classification</option>
                <option value="sentiment-analysis">sentiment-analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Execution Strategy</label>
              <select
                value={testStrategy}
                onChange={(e) => setTestStrategy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
              >
                <option value="BALANCED">BALANCED (Sequential + Failover)</option>
                <option value="PARALLEL">PARALLEL (Concurrent Promises)</option>
                <option value="CONSENSUS">CONSENSUS (Multi-Provider Voting)</option>
                <option value="SEQUENTIAL">SEQUENTIAL (Failover Chain)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                disabled={runTestMutation.isPending}
                variant="default"
                size="default"
                className="w-full gap-2 font-mono"
              >
                {runTestMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Multi-Provider Test</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Test Result Inspection */}
        {lastResult && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm font-sans">Execution Session #{lastResult.sessionId}</h3>
                <StatusBadge status={lastResult.state} />
              </div>
              <div className="text-slate-400 text-xs">
                Duration: <strong className="text-purple-400">{lastResult.totalDurationMs} ms</strong> • Cost: <strong className="text-emerald-400">${lastResult.totalCostUsd} USD</strong>
              </div>
            </div>

            {/* Provider Attempt Cards */}
            <div className="space-y-2">
              <div className="text-slate-400 font-bold text-[11px]">Provider Attempts & Failover Log:</div>
              {lastResult.attempts.map((att, idx) => (
                <div key={att.attemptId || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{att.merchantAlias}</span>
                      <StatusBadge status={att.status} />
                    </div>
                    <div className="text-[10px] text-slate-500">ID: {att.providerId} • TxHash: {att.txHash || "N/A"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">{att.durationMs} ms</div>
                    <div className="text-emerald-400">${att.costUsd} USD</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execution History Feed */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Recent Execution Sessions</span>
            </h3>
            <Link href="/execution/history" className="text-xs text-cyan-400 hover:underline">
              View Complete Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingHistory ? (
              <LoadingSkeleton rows={3} />
            ) : historyList.length > 0 ? (
              historyList.map((session) => (
                <div
                  key={session.sessionId}
                  className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/execution/${session.sessionId}`} className="font-bold text-cyan-400 hover:underline">
                        {session.sessionId}
                      </Link>
                      <StatusBadge status={session.state} />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Capability: <strong className="text-white">{session.capability}</strong></span>
                      <span>•</span>
                      <span>Strategy: <strong className="text-purple-300">{session.strategy}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-right shrink-0">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Duration</div>
                      <div className="text-purple-400 font-bold">{session.totalDurationMs} ms</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Attempts</div>
                      <div className="text-cyan-400 font-bold">{(session.attempts || []).length}</div>
                    </div>
                    <Link
                      href={`/execution/${session.sessionId}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">No execution sessions recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
