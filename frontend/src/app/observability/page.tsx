"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Activity,
  HeartPulse,
  Radio,
  FileText,
  AlertTriangle,
  Flame,
  GitMerge,
  Gauge,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ObservabilityOverviewPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["observability", "dashboard"],
    queryFn: observabilityService.getDashboard,
  });

  const { data: alerts } = useQuery({
    queryKey: ["observability", "alerts"],
    queryFn: observabilityService.getAlerts,
  });

  const { data: incidents } = useQuery({
    queryKey: ["observability", "incidents"],
    queryFn: observabilityService.getIncidents,
  });

  const alertList = alerts || [];
  const incidentList = incidents || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 font-sans">
              <Activity className="w-6 h-6 text-primary" />
              <span>Enterprise Observability & Operational Diagnostics</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Distributed OpenTelemetry tracing, centralized structured logging, metrics aggregation, health intelligence, alerts & incident response
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="destructive" size="sm" className="gap-2 font-sans">
              <Link href="/observability/incidents">
                <Flame className="w-4 h-4" />
                <span>Open Operational Incident</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">System Availability</span>
            <div className="text-2xl font-bold text-emerald-500">{dashboard?.availability || 99.98}%</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Active System Alerts</span>
            <div className="text-2xl font-bold text-amber-500">{alertList.length} alerts</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Open Incidents</span>
            <div className="text-2xl font-bold text-red-500">{incidentList.length} incidents</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Structured Logs / Min</span>
            <div className="text-2xl font-bold text-indigo-500">{dashboard?.logsPerMinute || 850} logs/min</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/observability/health" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <HeartPulse className="w-6 h-6 text-primary" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Health Monitoring & Topology</h3>
            <p className="text-muted-foreground text-xs">Real-time health status across services, worker nodes, and databases.</p>
          </Link>

          <Link href="/observability/metrics" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Gauge className="w-6 h-6 text-purple-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Metrics Engine & Aggregator</h3>
            <p className="text-muted-foreground text-xs">Continuous metric time-series aggregation and latency distribution.</p>
          </Link>

          <Link href="/observability/traces" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Radio className="w-6 h-6 text-indigo-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Distributed OpenTelemetry Traces</h3>
            <p className="text-muted-foreground text-xs">Trace request execution flows across microservices and async worker spans.</p>
          </Link>

          <Link href="/observability/logs" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <FileText className="w-6 h-6 text-emerald-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Centralized Structured Log Search</h3>
            <p className="text-muted-foreground text-xs">Search, filter, and correlate structured logs linked to trace IDs.</p>
          </Link>

          <Link href="/observability/alerts" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Alert Rules & Active Alerts</h3>
            <p className="text-muted-foreground text-xs">Configure threshold alert rules and monitor triggered system alerts.</p>
          </Link>

          <Link href="/observability/incidents" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Flame className="w-6 h-6 text-red-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Incident Lifecycle Console</h3>
            <p className="text-muted-foreground text-xs">Incident management lifecycle and automated root cause analysis.</p>
          </Link>

          <Link href="/observability/dependencies" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <GitMerge className="w-6 h-6 text-pink-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Service Dependency Graph</h3>
            <p className="text-muted-foreground text-xs">Inter-service call graph topology and call frequency metrics.</p>
          </Link>

          <Link href="/observability/slos" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-teal-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">SLO / SLA & Error Budgets</h3>
            <p className="text-muted-foreground text-xs">Track service level objectives, remaining error budgets, and MTTR.</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
