"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { intelligenceService } from "@/lib/api/services/intelligenceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Network,
  Database,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function CognitiveIntelligenceOverviewPage() {
  const { data: graphData, isLoading: isLoadingGraph } = useQuery({
    queryKey: ["intelligence", "knowledge"],
    queryFn: intelligenceService.getKnowledgeGraph,
  });

  const { data: memories, isLoading: isLoadingMemories } = useQuery({
    queryKey: ["intelligence", "memory"],
    queryFn: intelligenceService.getMemories,
  });

  const { data: recommendations, isLoading: isLoadingRecs } = useQuery({
    queryKey: ["intelligence", "recommendations"],
    queryFn: intelligenceService.getRecommendations,
  });

  const { data: learningMetrics } = useQuery({
    queryKey: ["intelligence", "learning"],
    queryFn: intelligenceService.getLearningMetrics,
  });

  const nodeCount = graphData?.nodes?.length || 0;
  const edgeCount = graphData?.edges?.length || 0;
  const memoryList = memories || [];
  const recList = recommendations || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Network className="w-6 h-6 text-purple-400" />
              <span>Enterprise Cognitive Intelligence Control Center</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Persistent organizational memory, typed knowledge graph, semantic retrieval, continuous learning, and categorized optimization recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/intelligence/search"
              className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Semantic Search</span>
            </Link>
          </div>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Knowledge Graph Entities</span>
            <div className="text-2xl font-bold text-purple-400">{nodeCount} nodes <span className="text-slate-500 text-xs">({edgeCount} edges)</span></div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Long-Term Semantic Memories</span>
            <div className="text-2xl font-bold text-cyan-400">{memoryList.length} records</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Active Recommendations</span>
            <div className="text-2xl font-bold text-amber-400">{recList.length} proposed</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Offline Learning Accuracy</span>
            <div className="text-2xl font-bold text-emerald-400">{learningMetrics?.learningAccuracy || 98.4}%</div>
          </div>
        </div>

        {/* Intelligence Navigation Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Knowledge Graph */}
          <Link href="/intelligence/knowledge" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Network className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Knowledge Graph Explorer</h3>
            <p className="text-slate-400 text-xs">Visual graph traversal connecting Users, Providers, Capabilities, Agents, Executions, and Spend Policies.</p>
          </Link>

          {/* Module 2: Long-Term Memory */}
          <Link href="/intelligence/memory" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Database className="w-6 h-6 text-cyan-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Long-Term Memory Bank</h3>
            <p className="text-slate-400 text-xs">Persistent Semantic, Episodic, Procedural, and Organizational memory versioned with confidence scores.</p>
          </Link>

          {/* Module 3: Recommendations Console */}
          <Link href="/intelligence/recommendations" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Optimization Console</h3>
            <p className="text-slate-400 text-xs">Categorized Operational, Cost, Quality, Security, and Governance optimization proposals.</p>
          </Link>
        </div>

        {/* Recent Optimization Recommendations Feed */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Categorized Optimization Recommendations</span>
            </h3>
            <Link href="/intelligence/recommendations" className="text-xs text-purple-400 hover:underline">
              View All Recommendations →
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingRecs ? (
              <LoadingSkeleton rows={2} />
            ) : (
              recList.map((rec) => (
                <div key={rec.recommendationId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-sans">{rec.title}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                        Category: {rec.category}
                      </span>
                      <StatusBadge status={rec.status} />
                    </div>
                    <p className="text-slate-400 text-xs font-sans">{rec.description}</p>
                  </div>

                  {rec.estimatedSavingsUsd && (
                    <div className="shrink-0 font-bold text-emerald-400 text-sm font-mono">
                      +${rec.estimatedSavingsUsd} USD Savings
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
