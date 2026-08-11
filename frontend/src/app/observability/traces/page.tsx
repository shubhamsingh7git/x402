"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TracesPage() {
  const { data: traces, isLoading } = useQuery({
    queryKey: ["observability", "traces", "all"],
    queryFn: observabilityService.getTraces,
  });

  const traceList = traces || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Distributed OpenTelemetry Traces Explorer</h1>
          </div>
          <p className="text-xs text-slate-400">
            End-to-end request trace correlation across microservices, async worker spans, and DB calls
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <span>OpenTelemetry Traces Journal ({traceList.length})</span>
          </h3>

          <div className="space-y-3">
            {traceList.map((t) => (
              <div key={t.traceId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{t.rootSpanName}</span>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-bold text-[10px] rounded font-mono">
                      ID: {t.traceId}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Service: {t.serviceName} • Duration: {t.durationMs}ms • Spans: {t.spansCount}</div>
                </div>

                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
