"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Box, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClustersPage() {
  const { data: clusters, isLoading } = useQuery({
    queryKey: ["devops", "clusters", "all"],
    queryFn: devopsService.getClusters,
  });

  const clusterList = clusters || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Kubernetes Clusters Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-cluster Kubernetes topology, provider, nodes, versions, and CPU/Memory utilization
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" />
            <span>Kubernetes Clusters ({clusterList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clusterList.map((c) => (
              <div key={c.clusterId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{c.name}</div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono space-y-1">
                  <div>Provider: <strong className="text-indigo-400">{c.provider}</strong> ({c.region}) • K8s: {c.kubernetesVersion}</div>
                  <div>Nodes: <strong className="text-cyan-400">{c.nodeCount}</strong> • CPU: {c.cpuUsagePercent}% • RAM: {c.memoryUsagePercent}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
