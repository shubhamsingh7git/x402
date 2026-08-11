"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function TeamsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: teams, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "teams", "all"],
    queryFn: controlPlaneService.getTeams,
  });

  const createTeamMutation = useMutation({
    mutationFn: controlPlaneService.createTeam,
    onSuccess: () => {
      setName("");
      setDescription("");
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate({
      organizationId: "org_default_01",
      name,
      description,
    });
  };

  const teamList = teams || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Teams & Membership Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Enterprise team groupings, user role assignments, and workspace member access control
          </p>
        </div>

        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Create New Team</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Team Name (e.g. Risk Compliance Squad)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={createTeamMutation.isPending}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-purple-500/20"
          >
            Create Team
          </button>
        </form>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Enterprise Teams ({teamList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamList.map((t) => (
              <div key={t.teamId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{t.name}</div>
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">
                    {t.memberCount} member(s)
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans">{t.description || "Enterprise workspace team"}</p>
                <div className="text-[10px] text-slate-500">ID: {t.teamId} • Org: {t.organizationId}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
