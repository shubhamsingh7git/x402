"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QueuesPage() {
  const { data: queues, isLoading } = useQuery({
    queryKey: ["distributed", "queues", "all"],
    queryFn: distributedService.getQueues,
  });

  const queueList = queues || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Partitioned Queue Explorer</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monitor queue depths, categories, pending jobs, and backpressure policies
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Partitioned System Queues ({queueList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {queueList.map((q) => (
              <div key={q.queueName} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{q.queueName}</div>
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                    Category: {q.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-900">
                  <div>Pending Jobs: <strong className="text-cyan-400">{q.pendingJobs}</strong></div>
                  <div>Running Jobs: <strong className="text-indigo-400">{q.runningJobs}</strong></div>
                  <div>Completed: <strong className="text-emerald-400">{q.completedJobs}</strong></div>
                  <div>Max Depth: <strong className="text-slate-400">{q.maxDepth}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
