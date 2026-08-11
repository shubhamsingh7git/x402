"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GitOpsPage() {
  const { data: gitOps, isLoading } = useQuery({
    queryKey: ["devops", "gitops", "all"],
    queryFn: devopsService.getGitOps,
  });

  const appList = gitOps || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">GitOps Application State Synchronization</h1>
          </div>
          <p className="text-xs text-slate-400">
            Declarative GitOps repository synchronization, target revisions, and manifest drift tracking
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>GitOps Applications ({appList.length})</span>
          </h3>

          <div className="space-y-3">
            {appList.map((a) => (
              <div key={a.appId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{a.appName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded font-mono">
                      Rev: {a.targetRevision}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Repo: {a.repoUrl} • Path: {a.path}</div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={a.syncStatus} />
                  <StatusBadge status={a.healthStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
