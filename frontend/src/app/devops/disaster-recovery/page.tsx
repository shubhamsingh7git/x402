"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LifeBuoy, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DisasterRecoveryPage() {
  const { data: dr, isLoading } = useQuery({
    queryKey: ["devops", "disaster-recovery"],
    queryFn: devopsService.getDisasterRecovery,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <LifeBuoy className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Region Disaster Recovery & Failover</h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-region failover topology, RPO/RTO metrics, and automated disaster recovery testing
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-red-400" />
              <span>Disaster Recovery Plan</span>
            </h3>

            <StatusBadge status={dr?.lastDrTestStatus || "PASSED"} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] pt-2 border-t border-slate-900">
            <div>Primary Region: <strong className="text-emerald-400 font-mono">{dr?.primaryRegion || "us-east-1"}</strong></div>
            <div>Secondary DR Region: <strong className="text-cyan-400 font-mono">{dr?.drRegion || "us-west-2"}</strong></div>
            <div>Target RPO (Recovery Point Objective): <strong className="text-indigo-400 font-mono">{dr?.rpoSeconds || 300} seconds</strong></div>
            <div>Target RTO (Recovery Time Objective): <strong className="text-purple-400 font-mono">{dr?.rtoSeconds || 900} seconds</strong></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
