"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CompliancePage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["security", "compliance", "reports"],
    queryFn: securityService.getCompliance,
  });

  const reportList = reports || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Compliance Framework Audits & Governance</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Continuous automated compliance tracking for GDPR, SOC2, ISO 27001, and PCI-ready abstractions
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-500" />
            <span>Compliance Audit Reports ({reportList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportList.map((r) => (
              <div key={r.framework} className="p-4 inner-box space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{r.framework}</div>
                  <StatusBadge status={r.overallStatus} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Controls Passed: <strong className="text-emerald-400">{r.passedControlsCount} / {r.totalControlsCount}</strong> ({r.scorePercent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
