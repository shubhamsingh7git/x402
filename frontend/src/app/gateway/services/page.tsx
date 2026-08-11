"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Network, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["gateway", "services", "all"],
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

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Microservice Registry Console</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Registered platform microservices, discovery URLs, version tags, and load weights
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <span>Registered Platform Microservices ({serviceList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceList.map((s) => (
              <div key={s.serviceId} className="p-4 inner-box space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground font-sans text-sm">{s.serviceName}</div>
                    <div className="text-[10px] text-muted-foreground">ID: {s.serviceId} • Ver: {s.version}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>

                <div className="space-y-1 text-muted-foreground text-xs font-mono pt-2 border-t border-border">
                  <div>Target Endpoint: <strong className="text-cyan-400">{s.targetUrl}</strong></div>
                  <div>Latency: <strong className="text-emerald-400">{s.latencyMs}ms</strong> • Weight: <strong className="text-purple-400">{s.weight}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
