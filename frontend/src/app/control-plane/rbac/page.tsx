"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RBACPage() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["control-plane", "roles", "all"],
    queryFn: controlPlaneService.getRoles,
  });

  const roleList = roles || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">RBAC v2 Matrix & Permission Inheritance</h1>
          </div>
          <p className="text-xs text-slate-400">
            Organization, workspace, project, and custom system roles declaring permission groups
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Role Definitions ({roleList.length})</span>
          </h3>

          <div className="space-y-3">
            {roleList.map((r) => (
              <div key={r.roleId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{r.roleName}</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                      Scope: {r.scope}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{r.isCustom ? "CUSTOM ROLE" : "SYSTEM ROLE"}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(r.permissions || []).map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-slate-900 text-cyan-400 rounded text-[10px] border border-slate-800 font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
