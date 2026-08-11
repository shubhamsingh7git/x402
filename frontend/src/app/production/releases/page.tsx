"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productionService } from "@/lib/api/services/productionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GitPullRequest, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function ReleasesPage() {
  const [version, setVersion] = useState("");
  const [title, setTitle] = useState("");

  const { data: releases, isLoading, refetch } = useQuery({
    queryKey: ["production", "releases", "all"],
    queryFn: productionService.getReleases,
  });

  const triggerReleaseMutation = useMutation({
    mutationFn: (payload: { version: string; title: string }) =>
      productionService.triggerRelease(payload.version, payload.title),
    onSuccess: () => {
      setVersion("");
      setTitle("");
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerReleaseMutation.mutate({ version, title });
  };

  const releaseList = releases || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Production Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Release Governance & Change Control</h1>
          </div>
          <p className="text-xs text-slate-400">
            Production change requests, release governance approvals, maintenance windows, and deployment freezes
          </p>
        </div>

        {/* Change Request Approval Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Submit Production Change Request</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="Release Version (e.g. v2.1.0)"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-48"
            />
            <input
              type="text"
              required
              placeholder="Release Description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs flex-1"
            />
            <button
              type="submit"
              disabled={triggerReleaseMutation.isPending}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20"
            >
              Approve Change Request
            </button>
          </div>
        </form>

        {/* Release Records */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-teal-400" />
            <span>Release Governance Records ({releaseList.length})</span>
          </h3>

          <div className="space-y-3">
            {releaseList.map((r) => (
              <div key={r.releaseId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{r.title}</span>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 font-bold text-[10px] rounded font-mono">
                      Version: {r.version}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Approved By: {r.approvedBy} • Release ID: {r.releaseId}</div>
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
