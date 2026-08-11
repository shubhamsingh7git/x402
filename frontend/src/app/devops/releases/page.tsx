"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReleasesPage() {
  const { data: releases, isLoading } = useQuery({
    queryKey: ["devops", "releases", "all"],
    queryFn: devopsService.getReleases,
  });

  const releaseList = releases || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Helm Chart Releases & Packages</h1>
          </div>
          <p className="text-xs text-slate-400">
            Helm chart release management, chart versions, app versions, and deployment namespaces
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span>Helm Releases ({releaseList.length})</span>
          </h3>

          <div className="space-y-3">
            {releaseList.map((r, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{r.releaseName}</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded font-mono">
                      Chart: {r.chartVersion}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Namespace: {r.namespace} • App Version: {r.appVersion}</div>
                </div>

                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
