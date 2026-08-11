"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Database, ArrowLeft, Brain, Layers } from "lucide-react";
import Link from "next/link";

export default function SharedMemoryPage() {
  const [targetSessionId, setTargetSessionId] = useState("");

  const { data: memoryList, isLoading } = useQuery({
    queryKey: ["agents", "memory", targetSessionId],
    queryFn: () => agentService.getSessionMemory(targetSessionId),
    enabled: !!targetSessionId,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/agents" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Shared Agent Memory & Context Artifacts</h1>
          </div>
          <p className="text-xs text-slate-400">
            Inspect persistent intermediate outputs, reasoning summaries, and shared context synchronized across agents
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter session ID (e.g. agsession_...)"
              value={targetSessionId}
              onChange={(e) => setTargetSessionId(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
          </div>

          <div className="space-y-3 pt-2">
            {!targetSessionId ? (
              <div className="p-6 text-center text-slate-500 text-xs">Enter a session ID to view shared memory artifacts</div>
            ) : isLoading ? (
              <div className="p-6 text-center text-slate-400 text-xs">Loading session memory artifacts...</div>
            ) : (memoryList || []).length > 0 ? (
              (memoryList || []).map((mem) => (
                <div key={mem.memoryId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-cyan-400">{mem.key}</div>
                    <div className="text-[10px] text-slate-500">Source: {mem.sourceAgentId}</div>
                  </div>
                  <pre className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-emerald-400 text-[11px] whitespace-pre-wrap font-mono">
                    {JSON.stringify(mem.value, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">No memory artifacts recorded for session #{targetSessionId}</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
