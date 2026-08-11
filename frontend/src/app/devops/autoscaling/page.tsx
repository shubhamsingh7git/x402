"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AutoscalingPage() {
  const { data: policies, isLoading } = useQuery({
    queryKey: ["devops", "autoscaling", "all"],
    queryFn: devopsService.getAutoscaling,
  });

  const policyList = policies || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Horizontal Pod Autoscaler (HPA) Policies</h1>
          </div>
          <p className="text-xs text-slate-400">
            Automated workload pod scaling based on real-time CPU and Memory utilization thresholds
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>HPA Policies ({policyList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {policyList.map((p) => (
              <div key={p.policyId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{p.deploymentName}</div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                    Replicas: {p.currentReplicas} ({p.minReplicas}-{p.maxReplicas})
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Target CPU: <strong className="text-cyan-400">{p.targetCpuPercent}%</strong> • Target RAM: <strong className="text-purple-400">{p.targetMemoryPercent}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
