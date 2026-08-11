"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Flag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FeatureFlagsPage() {
  const { data: flags, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "feature-flags", "all"],
    queryFn: controlPlaneService.getFeatureFlags,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      controlPlaneService.updateFeatureFlag(id, enabled),
    onSuccess: () => refetch(),
  });

  const flagList = flags || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Flag className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Targeted Feature Flags Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-scope feature flag targeting (GLOBAL, ORGANIZATION, WORKSPACE, PROJECT, ENVIRONMENT)
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" />
            <span>Platform Feature Flags ({flagList.length})</span>
          </h3>

          <div className="space-y-3">
            {flagList.map((f) => (
              <div key={f.flagId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{f.name}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded">
                      Scope: {f.targetScope}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Key: {f.key} • ID: {f.flagId}</div>
                </div>

                <button
                  onClick={() => toggleMutation.mutate({ id: f.flagId, enabled: !f.enabled })}
                  disabled={toggleMutation.isPending}
                  className={`px-4 py-1.5 font-bold rounded-lg text-xs transition-colors ${f.enabled ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-400"}`}
                >
                  {f.enabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
