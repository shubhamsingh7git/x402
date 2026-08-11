"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IncidentsPage() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ["security", "incidents", "all"],
    queryFn: securityService.getIncidents,
  });

  const incidentList = incidents || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Security Incidents & Response Triage</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Security incident triage, affected system resources, and mitigation playbooks
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Security Incidents ({incidentList.length})</span>
          </h3>

          <div className="space-y-3">
            {incidentList.map((inc) => (
              <div key={inc.incidentId} className="p-4 inner-box space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{inc.title}</div>
                  <StatusBadge status={inc.status} />
                </div>
                <div className="text-[10px] text-slate-500">{inc.summary} • ID: {inc.incidentId}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
