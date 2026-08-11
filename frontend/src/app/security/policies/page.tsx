"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PoliciesPage() {
  const { data: policies, isLoading } = useQuery({
    queryKey: ["security", "policies", "all"],
    queryFn: securityService.getPolicies,
  });

  const policyList = policies || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">PEP / PDP Authorization Policies & ABAC</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Policy Enforcement Point (PEP), Policy Decision Point (PDP), and Attribute-Based Access Control (ABAC) rules
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Authorization Rules ({policyList.length})</span>
          </h3>

          <div className="space-y-3">
            {policyList.map((p) => (
              <div key={p.policyId} className="p-4 inner-box flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{p.policyName}</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded font-mono">
                      Role: {p.subjectRole}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Resource: {p.resource} • Action: {p.action}</div>
                </div>

                <span className={`px-2.5 py-1 font-bold text-xs rounded ${p.effect === "PERMIT" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {p.effect}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
