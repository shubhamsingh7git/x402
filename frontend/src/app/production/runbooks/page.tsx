"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RunbooksPage() {
  const { data: runbooks, isLoading } = useQuery({
    queryKey: ["production", "runbooks", "all"],
    queryFn: productionService.getRunbooks,
  });

  const runbookList = runbooks || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Production Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Operational Runbooks & Incident Playbooks</h1>
          </div>
          <p className="text-xs text-slate-400">
            Standard operating procedures, incident remediation steps, and team ownership rosters
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>Operational Runbooks ({runbookList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {runbookList.map((rb) => (
              <div key={rb.runbookId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-white font-sans text-sm">{rb.title}</div>
                <div className="text-[10px] text-slate-400 font-mono space-y-1">
                  <div>Service: <strong className="text-pink-400">{rb.service}</strong> • Owner: {rb.ownerTeam}</div>
                  <div>Remediation Steps: <strong className="text-cyan-400">{rb.stepsCount} steps</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
