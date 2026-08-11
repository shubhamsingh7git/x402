"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["observability", "alerts", "all"],
    queryFn: observabilityService.getAlerts,
  });

  const { data: rules } = useQuery({
    queryKey: ["observability", "alert-rules"],
    queryFn: observabilityService.getAlertRules,
  });

  const alertList = alerts || [];
  const ruleList = rules || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Alert Rules & System Alerts Manager</h1>
          </div>
          <p className="text-xs text-slate-400">
            Clean separation of configured threshold rules (AlertRules) and triggered active alert events (Alerts)
          </p>
        </div>

        {/* Configured Alert Rules */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Configured Alert Rules ({ruleList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ruleList.map((r) => (
              <div key={r.ruleId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{r.ruleName}</div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                    {r.severity}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Metric: {r.targetMetric} • Threshold: {r.threshold}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Triggered System Alerts */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Triggered Active System Alerts ({alertList.length})</span>
          </h3>

          <div className="space-y-3">
            {alertList.map((a) => (
              <div key={a.alertId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{a.title}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                      {a.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Service: {a.serviceName} • Message: {a.message}</div>
                </div>

                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
