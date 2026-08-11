"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AgentExecutionPlanRecord } from "@/types";
import {
  Bot,
  Play,
  Zap,
  ShieldCheck,
  Brain,
  Layers,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function AgentPlatformOverviewPage() {
  const [prompt, setPrompt] = useState("Analyze market valuation and recent competitor news for NVDA");
  const [lastSession, setLastSession] = useState<AgentExecutionPlanRecord | null>(null);

  const { data: agentsData, isLoading: isLoadingRegistry } = useQuery({
    queryKey: ["agents", "registry"],
    queryFn: agentService.getRegistry,
  });

  const { data: executions, isLoading: isLoadingExecutions, refetch: refetchExecutions } = useQuery({
    queryKey: ["agents", "executions"],
    queryFn: () => agentService.getExecutions(10),
  });

  const { data: approvals } = useQuery({
    queryKey: ["agents", "approvals"],
    queryFn: agentService.getApprovals,
  });

  const orchestrateMutation = useMutation({
    mutationFn: agentService.orchestrateSession,
    onSuccess: (data) => {
      setLastSession(data);
      refetchExecutions();
    },
  });

  const handleOrchestrate = (e: React.FormEvent) => {
    e.preventDefault();
    orchestrateMutation.mutate(prompt);
  };

  const agents = agentsData || [];
  const sessionList = executions || [];
  const pendingCount = (approvals || []).filter((a) => a.status === "WAITING_APPROVAL").length;

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Bot className="w-6 h-6 text-cyan-400" />
              <span>Autonomous Multi-Agent Collaboration Platform</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic task decomposition, inter-agent communication, shared memory persistence, governance checks, and human approval workflows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agents/approvals"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700/60 flex items-center gap-2 relative"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Approvals</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Specialized Agents Roster</span>
            <div className="text-2xl font-bold text-white">{agents.length} <span className="text-emerald-400 text-sm">(All Online)</span></div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Orchestrated Sessions</span>
            <div className="text-2xl font-bold text-purple-400">{sessionList.length}</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Pending Human Gates</span>
            <div className={`text-2xl font-bold ${pendingCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {pendingCount} request(s)
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Governance Evaluation SLA</span>
            <div className="text-2xl font-bold text-cyan-400">98.2% Pass Rate</div>
          </div>
        </div>

        {/* Multi-Agent Orchestration Trigger Form */}
        <form onSubmit={handleOrchestrate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Trigger Multi-Agent Task Decomposition & Collaboration</span>
          </h3>

          <div className="space-y-3">
            <textarea
              rows={3}
              required
              placeholder="Describe complex goal for autonomous multi-agent decomposition..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500 text-xs"
            />

            <button
              type="submit"
              disabled={orchestrateMutation.isPending}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {orchestrateMutation.isPending ? (
                <span>Decomposing & Routing Subtasks to Specialized Agents...</span>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Execute Autonomous Multi-Agent Collaboration</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Last Orchestration Inspection */}
        {lastSession && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm font-sans">Multi-Agent Session #{lastSession.sessionId}</h3>
                <StatusBadge status={lastSession.status} />
              </div>
              <div className="text-slate-400 text-xs">
                Duration: <strong className="text-purple-400">{lastSession.totalDurationMs} ms</strong> • Cost: <strong className="text-emerald-400">${lastSession.totalCostUsd} USD</strong>
              </div>
            </div>

            {/* Task Graph Display */}
            <div className="space-y-2">
              <div className="text-slate-400 font-bold text-[11px]">Decomposed Task Graph & Agent Routing:</div>
              {lastSession.taskGraph.map((st) => (
                <div key={st.subtaskId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400">{st.subtaskId}</span>
                      <span className="text-white font-bold">{st.capability}</span>
                      <StatusBadge status={st.status} />
                    </div>
                    <div className="text-slate-400 text-xs">
                      Assigned Agent: <strong className="text-purple-400">{st.assignedAgentName || "Unassigned"}</strong>
                    </div>
                  </div>

                  {st.output && (
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 text-[11px]">
                      <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Subtask Output:</div>
                      <pre className="text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">{JSON.stringify(st.output, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialized Agent Roster Preview */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Specialized Agents Registry Roster</span>
            </h3>
            <Link href="/agents/registry" className="text-xs text-cyan-400 hover:underline">
              View Agent Capabilities →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingRegistry ? (
              <LoadingSkeleton rows={2} />
            ) : (
              agents.map((ag) => (
                <div key={ag.agentId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-sans">{ag.agentName}</div>
                      <div className="text-[10px] text-slate-500">Role: {ag.role}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                      Confidence: {Math.round(ag.confidenceScore * 100)}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(ag.capabilities || []).map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-slate-900 text-cyan-400 rounded text-[10px] border border-slate-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
