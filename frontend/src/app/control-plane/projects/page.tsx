"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FolderKanban, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [name, setName] = useState("");

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "projects", "all"],
    queryFn: () => controlPlaneService.getProjects(),
  });

  const createProjMutation = useMutation({
    mutationFn: controlPlaneService.createProject,
    onSuccess: () => {
      setName("");
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProjMutation.mutate({
      organizationId: "org_default_01",
      workspaceId: "ws_default_01",
      name,
    });
  };

  const projList = projects || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Projects Directory</h1>
          </div>
          <p className="text-xs text-slate-400">
            Project scoping for targeted feature flags, agent configurations, and spend policies
          </p>
        </div>

        {/* Create Project Form */}
        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create New Project</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="Project Name (e.g. Quantitative Market Analyzer)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
            <button
              type="submit"
              disabled={createProjMutation.isPending}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            >
              Create Project
            </button>
          </div>
        </form>

        {/* Projects Grid */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span>Active Projects ({projList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projList.map((p) => (
              <div key={p.projectId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-sans text-sm">{p.name}</div>
                    <div className="text-[10px] text-slate-500">ID: {p.projectId} • WS: {p.workspaceId}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
