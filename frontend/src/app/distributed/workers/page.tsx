"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Server, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkersPage() {
  const { data: workers, isLoading } = useQuery({
    queryKey: ["distributed", "workers", "all"],
    queryFn: distributedService.getWorkers,
  });

  const workerList = workers || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Specialized Worker Roster & Heartbeats</h1>
          </div>
          <p className="text-xs text-slate-400">
            Worker node registrations, heartbeat monitoring, and active job concurrencies
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Active Worker Nodes ({workerList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workerList.map((w) => (
              <div key={w.workerId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-sans text-sm">Worker #{w.workerId}</div>
                    <div className="text-[10px] text-slate-500">Type: {w.workerType}</div>
                  </div>
                  <StatusBadge status={w.status} />
                </div>

                <div className="space-y-1 text-slate-400 text-xs font-mono pt-2 border-t border-slate-900">
                  <div>Assigned Queues: <strong className="text-indigo-400">{(w.assignedQueues || []).join(", ")}</strong></div>
                  <div>Active Jobs: <strong className="text-cyan-400">{w.activeJobsCount}</strong> • Processed: <strong className="text-emerald-400">{w.processedJobsCount}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
