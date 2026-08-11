"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Key, ArrowLeft, Plus, Copy, Check } from "lucide-react";
import Link from "next/link";
import { APIKeyRecord } from "@/types";

export default function APIKeysPage() {
  const [keyName, setKeyName] = useState("");
  const [newRawKey, setNewRawKey] = useState<string | null>(null);

  const { data: apiKeys, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "api-keys", "all"],
    queryFn: () => controlPlaneService.createAPIKey({ organizationId: "org_default_01", keyName: "Default Inspection Key" }).then(() => controlPlaneService.getOrganizations()).then(() => []),
  });

  const createKeyMutation = useMutation({
    mutationFn: controlPlaneService.createAPIKey,
    onSuccess: (data) => {
      setKeyName("");
      if (data.rawKey) setNewRawKey(data.rawKey);
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createKeyMutation.mutate({
      organizationId: "org_default_01",
      keyName,
      scopes: ["planner:read", "execution:start"],
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Scoped API Credentials & Keys</h1>
          </div>
          <p className="text-xs text-slate-400">
            Generate scoped API keys with explicit permissions (planner:read, execution:start, admin)
          </p>
        </div>

        {/* Generate API Key Form */}
        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Generate New API Key</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="API Key Name (e.g. Production Service Key)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
            <button
              type="submit"
              disabled={createKeyMutation.isPending}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            >
              Generate API Key
            </button>
          </div>

          {newRawKey && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="text-emerald-400 font-bold font-sans">API Key Created! Copy it now (will not be shown again):</div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-emerald-300 font-mono text-xs select-all">
                {newRawKey}
              </div>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  );
}
