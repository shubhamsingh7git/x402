"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { intelligenceService } from "@/lib/api/services/intelligenceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Network, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KnowledgeGraphPage() {
  const { data: graphData, isLoading } = useQuery({
    queryKey: ["intelligence", "knowledge", "all"],
    queryFn: intelligenceService.getKnowledgeGraph,
  });

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/intelligence" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Intelligence Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Knowledge Graph Visualizer</h1>
          </div>
          <p className="text-xs text-slate-400">
            Typed nodes and relationship edges connecting Users, Providers, Capabilities, Agents, Executions, and Spend Policies
          </p>
        </div>

        {/* Nodes Grid */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" />
            <span>Knowledge Graph Entity Nodes ({nodes.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((n) => (
              <div key={n.nodeId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">{n.nodeId}</span>
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                    {n.nodeType}
                  </span>
                </div>
                <div className="font-bold text-white text-xs font-sans">{n.label}</div>
                {n.properties && (
                  <pre className="p-2 bg-slate-900/80 border border-slate-800 rounded text-[10px] text-slate-400 overflow-x-auto">
                    {JSON.stringify(n.properties, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edges Feed */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" />
            <span>Typed Relationship Edges ({edges.length})</span>
          </h3>

          <div className="space-y-3">
            {edges.map((e) => (
              <div key={e.edgeId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-purple-400">{e.sourceNodeId}</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-cyan-400 text-[10px] font-bold border border-slate-800 rounded">
                    → {e.relationshipType} →
                  </span>
                  <span className="font-bold text-purple-400">{e.targetNodeId}</span>
                </div>
                <div className="text-slate-500 text-[10px]">Weight: {e.weight} • Version: {e.version}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
