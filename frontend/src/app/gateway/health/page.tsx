"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HeartPulse, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HealthPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["gateway", "health", "services"],
    queryFn: gatewayService.getServices,
  });

  const serviceList = services || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/gateway" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to API Gateway Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Service Mesh Health Roster</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time microservice health checks, latency probes, and circuit breaker status
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-amber-400" />
            <span>Health Check Topology ({serviceList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceList.map((s) => (
              <div key={s.serviceId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{s.serviceName}</div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Endpoint: {s.targetUrl} • Latency: <strong className="text-emerald-400">{s.latencyMs}ms</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
