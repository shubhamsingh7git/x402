"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Layers, ArrowLeft, RefreshCw, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function DeploymentsPage() {
  const { data: deployments, isLoading, refetch } = useQuery({
    queryKey: ["devops", "deployments", "all"],
    queryFn: devopsService.getDeployments,
  });

  const deployMutation = useMutation({
    mutationFn: (payload: { deploymentId: string; imageTag: string }) =>
      devopsService.triggerDeploy(payload.deploymentId, payload.imageTag),
    onSuccess: () => refetch(),
  });

  const rollbackMutation = useMutation({
    mutationFn: devopsService.triggerRollback,
    onSuccess: () => refetch(),
  });

  const deploymentList = deployments || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Workload Deployments & Progressive Rollouts</h1>
          </div>
          <p className="text-xs text-slate-400">
            Canary and Blue/Green progressive rollouts, container image tags, replica sets, and instant rollbacks
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Workload Deployments ({deploymentList.length})</span>
          </h3>

          <div className="space-y-3">
            {deploymentList.map((d) => (
              <div key={d.deploymentId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{d.name}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 font-bold text-[10px] rounded font-mono">
                      Tag: {d.imageTag}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Namespace: {d.namespace} • Strategy: {d.strategy} • Replicas: {d.availableReplicas} / {d.replicas}</div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={d.status} />
                  <button
                    onClick={() => deployMutation.mutate({ deploymentId: d.deploymentId, imageTag: "v1.4.1-rc1" })}
                    disabled={deployMutation.isPending}
                    className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold rounded flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Deploy</span>
                  </button>
                  <button
                    onClick={() => rollbackMutation.mutate(d.deploymentId)}
                    disabled={rollbackMutation.isPending}
                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rollback</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
