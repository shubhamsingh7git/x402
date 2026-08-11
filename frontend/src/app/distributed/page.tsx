"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Server,
  Cpu,
  Layers,
  Clock,
  AlertTriangle,
  Radio,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DistributedOverviewPage() {
  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["distributed", "jobs"],
    queryFn: distributedService.getJobs,
  });

  const { data: queues } = useQuery({
    queryKey: ["distributed", "queues"],
    queryFn: distributedService.getQueues,
  });

  const { data: workers } = useQuery({
    queryKey: ["distributed", "workers"],
    queryFn: distributedService.getWorkers,
  });

  const { data: dlq } = useQuery({
    queryKey: ["distributed", "dead-letter"],
    queryFn: distributedService.getDeadLetterJobs,
  });

  const jobList = jobs || [];
  const queueList = queues || [];
  const workerList = workers || [];
  const dlqList = dlq || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 font-sans">
              <Server className="w-6 h-6 text-primary" />
              <span>Distributed Infrastructure & Job Orchestration</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Horizontally scalable worker pools, partitioned job queues, retry policies, dead-letter queue, cron scheduler, and event bus
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="default" size="sm" className="gap-2 font-sans">
              <Link href="/distributed/jobs">
                <Layers className="w-4 h-4" />
                <span>Enqueue Job</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Active Worker Nodes</span>
            <div className="text-2xl font-bold text-primary">{workerList.length} workers</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Partitioned Queues</span>
            <div className="text-2xl font-bold text-purple-500">{queueList.length} queues</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Total Processed Jobs</span>
            <div className="text-2xl font-bold text-indigo-500">{jobList.length} jobs</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Dead Letter Jobs</span>
            <div className="text-2xl font-bold text-amber-500">{dlqList.length} jobs</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/distributed/jobs" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Layers className="w-6 h-6 text-primary" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Asynchronous Jobs Console</h3>
            <p className="text-muted-foreground text-xs">Enqueue, inspect, retry, and manage asynchronous task executions.</p>
          </Link>

          <Link href="/distributed/queues" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Cpu className="w-6 h-6 text-purple-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Partitioned Queue Explorer</h3>
            <p className="text-muted-foreground text-xs">Monitor queue depths, categories, and backpressure policies.</p>
          </Link>

          <Link href="/distributed/workers" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Server className="w-6 h-6 text-indigo-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Specialized Worker Roster</h3>
            <p className="text-muted-foreground text-xs">Track active worker nodes, heartbeats, and job concurrency.</p>
          </Link>

          <Link href="/distributed/scheduler" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-emerald-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Cron & Task Scheduler</h3>
            <p className="text-muted-foreground text-xs">Manage recurring background learning, optimization, and cleanup tasks.</p>
          </Link>

          <Link href="/distributed/dead-letter" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Dead Letter Queue Console</h3>
            <p className="text-muted-foreground text-xs">Inspect failed jobs and trigger idempotent job replays.</p>
          </Link>

          <Link href="/distributed/events" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Radio className="w-6 h-6 text-pink-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Distributed Event Bus</h3>
            <p className="text-muted-foreground text-xs">Real-time stream of cross-domain system event publications.</p>
          </Link>
        </div>

        {/* Recent Jobs Table */}
        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Recent Asynchronous Jobs Stream</span>
            </h3>
            <Link href="/distributed/jobs" className="text-xs text-primary hover:underline">
              View All Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingJobs ? (
              <LoadingSkeleton rows={2} />
            ) : (
              jobList.map((j) => (
                <div key={j.jobId} className="p-4 inner-box space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-sans text-sm">Job #{j.jobId}</div>
                      <div className="text-[10px] text-slate-500">Queue: {j.queueName} • Category: {j.category}</div>
                    </div>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="text-slate-400 text-xs font-mono pt-1">
                    Priority: <strong className="text-purple-400">{j.priority}</strong> • Retries: <strong className="text-cyan-400">{j.retryCount}/{j.maxRetries}</strong>
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
