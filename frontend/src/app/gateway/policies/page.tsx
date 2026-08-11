"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PoliciesPage() {
  const { data: policies, isLoading } = useQuery({
    queryKey: ["gateway", "policies", "all"],
    queryFn: gatewayService.getPolicies,
  });

  const policyList = policies || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/gateway" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to API Gateway Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Traffic & Gateway Policies Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Rate limiting rules, burst limits, tenant quota policy enforcement, and gateway cache configurations
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Active Gateway Policies ({policyList.length})</span>
          </h3>

          <div className="space-y-3">
            {policyList.map((p) => (
              <div key={p.policyId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{p.policyId}</div>
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-bold text-[10px] rounded">
                    Scope: {p.scope}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-900 text-[11px]">
                  <div>Rate Limit: <strong className="text-cyan-400">{p.rateLimitPerMin} req/min</strong></div>
                  <div>Burst Limit: <strong className="text-purple-400">{p.burstLimit} reqs</strong></div>
                  <div>Cache Enabled: <strong className="text-emerald-400">{p.cacheEnabled ? "YES" : "NO"}</strong></div>
                  <div>Cache TTL: <strong className="text-amber-400">{p.cacheTtlSeconds}s</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
