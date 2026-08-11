"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Save, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function BackupsPage() {
  const [name, setName] = useState("");

  const { data: backups, isLoading, refetch } = useQuery({
    queryKey: ["devops", "backups", "all"],
    queryFn: devopsService.getBackups,
  });

  const triggerBackupMutation = useMutation({
    mutationFn: (backupName: string) => devopsService.triggerBackup(backupName),
    onSuccess: () => {
      setName("");
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    triggerBackupMutation.mutate(name);
  };

  const backupList = backups || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Cluster Volume Backups & Snapshots Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            Cluster persistent volume snapshots, scheduled backups, and point-in-time snapshot restores
          </p>
        </div>

        {/* Trigger Backup Form */}
        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-pink-400" />
            <span>Create Volume Snapshot</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="Snapshot Name (e.g. On-Demand Production Snapshot)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
            <button
              type="submit"
              disabled={triggerBackupMutation.isPending}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-pink-500/20"
            >
              Take Snapshot
            </button>
          </div>
        </form>

        {/* Backups List */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Save className="w-4 h-4 text-pink-400" />
            <span>Volume Snapshots ({backupList.length})</span>
          </h3>

          <div className="space-y-3">
            {backupList.map((b) => (
              <div key={b.backupId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{b.name}</span>
                    <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 font-bold text-[10px] rounded font-mono">
                      Cluster: {b.targetCluster}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Size: {b.snapshotSizeGb} GB • Backup ID: {b.backupId}</div>
                </div>

                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
