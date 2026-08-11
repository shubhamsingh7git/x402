"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Layers, ArrowLeft, Plus, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DistributedJobsPage() {
  const [queueName, setQueueName] = useState("high-priority");
  const [category, setCategory] = useState("EXECUTION");

  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: ["distributed", "jobs", "all"],
    queryFn: distributedService.getJobs,
  });

  const createJobMutation = useMutation({
    mutationFn: distributedService.createJob,
    onSuccess: () => refetch(),
  });

  const retryMutation = useMutation({
    mutationFn: distributedService.retryJob,
    onSuccess: () => refetch(),
  });

  const cancelMutation = useMutation({
    mutationFn: distributedService.cancelJob,
    onSuccess: () => refetch(),
  });

  const handleEnqueue = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({
      queueName,
      category,
      payload: { action: "MANUAL_ENQUEUE", timestamp: new Date() },
      priority: 10,
    });
  };

  const jobList = jobs || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Asynchronous Jobs Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Enqueue, inspect, retry, and cancel background execution jobs
          </p>
        </div>

        {/* Enqueue Form */}
        <form onSubmit={handleEnqueue} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Enqueue Asynchronous Job</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Queue Name (e.g. high-priority)"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <input
              type="text"
              required
              placeholder="Job Category (e.g. EXECUTION)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={createJobMutation.isPending}
            variant="default"
            size="sm"
          >
            Enqueue Job
          </Button>
        </form>

        {/* Jobs List */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Active & Processed Jobs ({jobList.length})</span>
          </h3>

          <div className="space-y-3">
            {jobList.map((j) => (
              <div key={j.jobId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">Job #{j.jobId}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 font-bold text-[10px] rounded">
                      Queue: {j.queueName}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Category: {j.category} • Priority: {j.priority} • Retries: {j.retryCount}/{j.maxRetries}</div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={j.status} />

                  {j.status === "FAILED" && (
                    <Button
                      onClick={() => retryMutation.mutate(j.jobId)}
                      variant="warning"
                      size="xs"
                      className="gap-1 font-mono"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </Button>
                  )}

                  {j.status === "QUEUED" && (
                    <Button
                      onClick={() => cancelMutation.mutate(j.jobId)}
                      variant="destructive"
                      size="xs"
                      className="gap-1 font-mono"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
