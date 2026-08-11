"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { researchService } from "@/lib/api/services/researchService";
import { AppLayout } from "@/components/layout/AppLayout";
import { TimelineViewer } from "@/components/shared/TimelineViewer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import { ResearchPlanStep, TimelineEvent, AgentRun } from "@/types";
import { Bot, Play, Sparkles, CheckCircle2, DollarSign, Clock, Download, RefreshCw, FileText } from "lucide-react";
import { getSocket } from "@/lib/socket";

import { Button } from "@/components/ui/button";

export default function ResearchPage() {
  const [query, setQuery] = useState("Analyze market valuation and autonomous micro-transaction metrics");
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ResearchPlanStep[]>([]);
  const [liveTimeline, setLiveTimeline] = useState<TimelineEvent[]>([]);
  const [executionResults, setExecutionResults] = useState<any | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [jsonInspectorData, setJsonInspectorData] = useState<any | null>(null);

  // Fetch Run History
  const { data: runs, refetch: refetchRuns } = useQuery({
    queryKey: ["research", "runs"],
    queryFn: researchService.listRuns,
  });

  // Socket.IO Real-time Timeline Listener
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onTimelineUpdate = (event: TimelineEvent) => {
      if (activeRunId && event.runId === activeRunId) {
        setLiveTimeline((prev) => [...prev, event]);
      }
    };

    socket.on("timeline:update", onTimelineUpdate);
    return () => {
      socket.off("timeline:update", onTimelineUpdate);
    };
  }, [activeRunId]);

  // Plan Generation Mutation
  const planMutation = useMutation({
    mutationFn: researchService.generatePlan,
    onSuccess: (data) => {
      setActiveRunId(data.runId);
      setCurrentPlan(data.plan);
      setLiveTimeline([]);
      setExecutionResults(null);
    },
  });

  // Execution Mutation
  const executeMutation = useMutation({
    mutationFn: (vars: { runId: string; plan: ResearchPlanStep[] }) =>
      researchService.executePlan(vars.runId, vars.plan),
    onSuccess: (data) => {
      setExecutionResults(data.results);
      setTotalCost(data.totalCost);
      refetchRuns();
    },
  });

  const handleGenerateAndExecute = async () => {
    if (!query) return;
    const planRes = await planMutation.mutateAsync(query);
    if (planRes?.runId && planRes?.plan) {
      await executeMutation.mutateAsync({ runId: planRes.runId, plan: planRes.plan });
    }
  };

  const handleDownloadResult = () => {
    if (!executionResults) return;
    const blob = new Blob([JSON.stringify(executionResults, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research_result_${activeRunId || "export"}.json`;
    a.click();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400" />
              <span>Autonomous AI Research & Execution Engine</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Multi-step LLM planning with automated x402 micro-payment settlement & verified service resolution
            </p>
          </div>
        </div>

        {/* Query Input Panel */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
          <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Research Prompt / Execution Objective
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Conduct deep market analysis and retrieve financial benchmark metrics..."
              className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <Button
              onClick={handleGenerateAndExecute}
              disabled={!query || planMutation.isPending || executeMutation.isPending}
              variant="default"
              size="lg"
              className="gap-2 font-mono"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {planMutation.isPending
                  ? "Generating Plan..."
                  : executeMutation.isPending
                  ? "Executing x402 Flow..."
                  : "Start Autonomous Research"}
              </span>
            </Button>
          </div>
        </div>

        {/* Live Execution Pipeline Panel */}
        {currentPlan.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Generated Step Plan */}
            <div className="lg:col-span-2 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Execution Plan ({currentPlan.length} Steps)</span>
                </h3>
                {executionResults && (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Total Cost: ${Number(totalCost ?? 0).toFixed(4)} USD</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 font-mono text-xs">
                {currentPlan.map((step) => (
                  <div key={step.id} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold">
                          {step.id}
                        </span>
                        <span className="font-bold text-white">{step.title}</span>
                      </div>
                      <StatusBadge status={step.type} />
                    </div>
                    <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800">
                      Input: {JSON.stringify(step.input)}
                    </div>
                  </div>
                ))}
              </div>

              {executionResults && (
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <Button
                    onClick={handleDownloadResult}
                    variant="success"
                    size="sm"
                    className="gap-2 font-mono"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Result</span>
                  </Button>
                  <Button
                    onClick={() => setJsonInspectorData(executionResults)}
                    variant="outline"
                    size="sm"
                    className="gap-2 font-mono"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Inspect Raw Output</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Live Real-time Timeline */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Live x402 Settlement Stream</span>
              </h3>
              <TimelineViewer events={liveTimeline} onInspectMetadata={(meta) => setJsonInspectorData(meta)} />
            </div>
          </div>
        )}

        {/* History Table */}
        {runs && runs.length > 0 && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white font-mono">Recent Research Executions</h3>
            <div className="divide-y divide-slate-800 font-mono text-xs">
              {runs.map((r) => (
                <div key={r._id} className="py-3 flex items-center justify-between text-slate-300">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{r.query}</div>
                    <div className="text-[11px] text-slate-500">ID: {r._id} • {r.steps?.length || 0} steps</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    <span className="text-slate-500 text-[11px]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Inspector Modal */}
        <JsonInspectorModal
          isOpen={!!jsonInspectorData}
          onClose={() => setJsonInspectorData(null)}
          title="Execution Telemetry Payload"
          data={jsonInspectorData}
        />
      </div>
    </AppLayout>
  );
}
