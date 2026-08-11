"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeadLetterQueuePage() {
  const { data: dlq, isLoading, refetch } = useQuery({
    queryKey: ["distributed", "dead-letter", "all"],
    queryFn: distributedService.getDeadLetterJobs,
  });

  const replayMutation = useMutation({
    mutationFn: distributedService.replayDeadLetterJob,
    onSuccess: () => refetch(),
  });

  const dlqList = dlq || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Dead Letter Queue & Replay Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Failed jobs after retry policy exhaustion with idempotent job replay capabilities
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Dead Letter Queue Jobs ({dlqList.length})</span>
          </h3>

          <div className="space-y-3">
            {dlqList.map((j) => (
              <div key={j.jobId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">Job #{j.jobId}</span>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="text-[10px] text-slate-500">Queue: {j.queueName} • Error: {j.errorMessage || "Exhausted maximum retry limit"}</div>
                </div>

                <Button
                  onClick={() => replayMutation.mutate(j.jobId)}
                  disabled={replayMutation.isPending}
                  variant="warning"
                  size="sm"
                  className="gap-1.5 font-mono text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replay Job</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
