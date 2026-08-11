"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Globe,
  Network,
  Route,
  Shield,
  Activity,
  HeartPulse,
  RefreshCw,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GatewayOverviewPage() {
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["gateway", "services"],
    queryFn: gatewayService.getServices,
  });

  const { data: routes } = useQuery({
    queryKey: ["gateway", "routes"],
    queryFn: gatewayService.getRoutes,
  });

  const { data: metrics } = useQuery({
    queryKey: ["gateway", "metrics"],
    queryFn: gatewayService.getMetrics,
  });

  const reloadMutation = useMutation({
    mutationFn: gatewayService.reloadConfiguration,
  });

  const clearCacheMutation = useMutation({
    mutationFn: gatewayService.clearCache,
  });

  const serviceList = services || [];
  const routeList = routes || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 font-sans">
              <Globe className="w-6 h-6 text-primary" />
              <span>Enterprise API Gateway & Service Mesh</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Unified request pipeline, zero-trust authentication, microservice discovery, traffic routing, and P50/P95/P99 telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => reloadMutation.mutate()}
              disabled={reloadMutation.isPending}
              variant="default"
              size="sm"
              className="gap-2 font-sans"
            >
              <RefreshCw className={`w-4 h-4 ${reloadMutation.isPending ? "animate-spin" : ""}`} />
              <span>Hot Reload Gateway</span>
            </Button>
            <Button
              onClick={() => clearCacheMutation.mutate()}
              disabled={clearCacheMutation.isPending}
              variant="outline"
              size="sm"
              className="gap-2 font-sans"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
              <span>Clear Cache</span>
            </Button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Registered Microservices</span>
            <div className="text-2xl font-bold text-primary">{serviceList.length} services</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Active Gateway Routes</span>
            <div className="text-2xl font-bold text-purple-500">{routeList.length} routes</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Requests / Minute</span>
            <div className="text-2xl font-bold text-indigo-500">{metrics?.requestsPerMinute || 340} req/min</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">P95 Latency Percentile</span>
            <div className="text-2xl font-bold text-emerald-500">{metrics?.p95LatencyMs || 18} ms</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/gateway/services" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Network className="w-6 h-6 text-primary" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Microservice Registry</h3>
            <p className="text-muted-foreground text-xs">Monitor service endpoints, discovery mapping, and load weights.</p>
          </Link>

          <Link href="/gateway/routes" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Route className="w-6 h-6 text-purple-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Route Rules & Versioning</h3>
            <p className="text-muted-foreground text-xs">API version routing (/api/v1, /api/v2) and path pattern definitions.</p>
          </Link>

          <Link href="/gateway/policies" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Shield className="w-6 h-6 text-indigo-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Traffic & Gateway Policies</h3>
            <p className="text-muted-foreground text-xs">Rate limiting rules, burst policies, tenant quotas, and caching.</p>
          </Link>

          <Link href="/gateway/metrics" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-emerald-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">P50 / P95 / P99 Latency Metrics</h3>
            <p className="text-muted-foreground text-xs">Gateway throughput, active connections, and latency percentiles.</p>
          </Link>

          <Link href="/gateway/health" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <HeartPulse className="w-6 h-6 text-amber-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Service Mesh Health Roster</h3>
            <p className="text-muted-foreground text-xs">Real-time health monitoring and active circuit breaker states.</p>
          </Link>
        </div>

        {/* Microservices Topology Table */}
        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              <span>Registered Platform Microservices Topology</span>
            </h3>
            <Link href="/gateway/services" className="text-xs text-primary hover:underline">
              View All Services →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingServices ? (
              <LoadingSkeleton rows={2} />
            ) : (
              serviceList.map((s) => (
                <div key={s.serviceId} className="p-4 inner-box space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-sans text-sm">{s.serviceName}</div>
                      <div className="text-[10px] text-slate-500">Target: {s.targetUrl} • Ver: {s.version}</div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="text-slate-400 text-xs font-mono pt-1">
                    Latency: <strong className="text-emerald-400">{s.latencyMs}ms</strong> • Weight: <strong className="text-purple-400">{s.weight}</strong>
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
