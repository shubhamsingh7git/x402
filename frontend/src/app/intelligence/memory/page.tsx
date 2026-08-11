"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { intelligenceService } from "@/lib/api/services/intelligenceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Database, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LongTermMemoryPage() {
  const { data: memories, isLoading } = useQuery({
    queryKey: ["intelligence", "memory", "all"],
    queryFn: intelligenceService.getMemories,
  });

  const memoryList = memories || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/intelligence" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Intelligence Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Long-Term Semantic Memory Bank</h1>
          </div>
          <p className="text-xs text-slate-400">
            Persistent Semantic, Episodic, Procedural, and Organizational memory versioned with confidence scores
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Persistent Memory Records ({memoryList.length})</span>
          </h3>

          <div className="space-y-3">
            {memoryList.map((mem) => (
              <div key={mem.memoryId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{mem.memoryId}</span>
                    <span className="font-bold text-white text-sm font-sans">{mem.title}</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                      {mem.memoryType}
                    </span>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs">
                    Confidence: {Math.round(mem.confidenceScore * 100)}%
                  </div>
                </div>

                <p className="text-slate-300 text-xs font-sans p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                  {mem.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div>Domain: {mem.sourceDomain} • Version: {mem.memoryVersion}</div>
                  <div className="flex items-center gap-1">
                    {(mem.tags || []).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
