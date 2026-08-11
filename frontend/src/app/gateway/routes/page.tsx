"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gatewayService } from "@/lib/api/services/gatewayService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Route, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RoutesPage() {
  const { data: routes, isLoading } = useQuery({
    queryKey: ["gateway", "routes", "all"],
    queryFn: gatewayService.getRoutes,
  });

  const routeList = routes || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/gateway" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to API Gateway Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Route className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Route Rules & API Versioning</h1>
          </div>
          <p className="text-xs text-slate-400">
            Path pattern definitions, target microservice mappings, and API version routers (/api/v1, /api/v2)
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Route className="w-4 h-4 text-purple-400" />
            <span>Active Route Definitions ({routeList.length})</span>
          </h3>

          <div className="space-y-3">
            {routeList.map((r) => (
              <div key={r.routeId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{r.pathPattern}</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded font-mono">
                      Target: {r.targetServiceId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Version: {r.apiVersion} • Auth: {r.authRequired ? "REQUIRED" : "PUBLIC"}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-900 text-slate-400 text-xs">
                  <span>Allowed Methods:</span>
                  {(r.methods || []).map((m) => (
                    <span key={m} className="px-2 py-0.5 bg-slate-900 text-cyan-400 font-mono text-[10px] rounded border border-slate-800">
                      {m}
                    </span>
                  ))}
                  <span className="ml-auto text-slate-500 text-[10px]">Rate Limit: {r.rateLimitPerMin} req/min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
