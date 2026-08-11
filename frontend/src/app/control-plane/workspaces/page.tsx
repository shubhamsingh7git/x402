"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FolderKanban, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function WorkspacesPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const { data: workspaces, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "workspaces", "all"],
    queryFn: () => controlPlaneService.getWorkspaces(),
  });

  const createWsMutation = useMutation({
    mutationFn: controlPlaneService.createWorkspace,
    onSuccess: () => {
      setName("");
      setSlug("");
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createWsMutation.mutate({ organizationId: "org_default_01", name, slug });
  };

  const wsList = workspaces || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces Explorer</h1>
          </div>
          <p className="text-xs text-slate-400">
            Tenant workspace boundary containing projects, teams, API keys, and environment settings
          </p>
        </div>

        {/* Create Workspace Form */}
        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Create New Workspace</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Workspace Name (e.g. Staging Environment)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
              }}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <input
              type="text"
              required
              placeholder="Workspace Slug (e.g. staging-env)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={createWsMutation.isPending}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-purple-500/20"
          >
            Create Workspace
          </button>
        </form>

        {/* Workspaces List */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-purple-400" />
            <span>Active Workspaces ({wsList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wsList.map((w) => (
              <div key={w.workspaceId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-sans text-sm">{w.name}</div>
                    <div className="text-[10px] text-slate-500">ID: {w.workspaceId} • Org: {w.organizationId}</div>
                  </div>
                  <StatusBadge status={w.status} />
                </div>

                <div className="text-slate-400 text-xs font-mono pt-2 border-t border-slate-900">
                  Max Projects: <strong className="text-purple-400">{w.maxProjects}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
