"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GitBranch, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PipelinesPage() {
  const { data: pipelines, isLoading } = useQuery({
    queryKey: ["devops", "pipelines", "all"],
    queryFn: devopsService.getPipelines,
  });

  const pipelineList = pipelines || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">CI/CD Pipelines & Build Runs</h1>
          </div>
          <p className="text-xs text-slate-400">
            Continuous integration automated pipelines, repository triggers, branches, and build statuses
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span>CI/CD Pipelines ({pipelineList.length})</span>
          </h3>

          <div className="space-y-3">
            {pipelineList.map((p) => (
              <div key={p.pipelineId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{p.name}</span>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-bold text-[10px] rounded font-mono">
                      Branch: {p.branch}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Repo: {p.repositoryUrl} • Total Builds: {p.totalBuildsCount}</div>
                </div>

                <StatusBadge status={p.lastRunStatus} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
