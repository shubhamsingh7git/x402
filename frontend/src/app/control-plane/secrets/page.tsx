"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Lock, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { SecretRecord } from "@/types";

export default function SecretsPage() {
  const [keyName, setKeyName] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [lastStored, setLastStored] = useState<SecretRecord | null>(null);

  const storeMutation = useMutation({
    mutationFn: controlPlaneService.storeSecret,
    onSuccess: (data) => {
      setLastStored(data);
      setKeyName("");
      setSecretValue("");
    },
  });

  const handleStore = (e: React.FormEvent) => {
    e.preventDefault();
    storeMutation.mutate({
      organizationId: "org_default_01",
      keyName,
      secretValue,
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
            <Lock className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Encrypted Secrets Vault</h1>
          </div>
          <p className="text-xs text-slate-400">
            AES-256 encrypted secrets vault with versioning (ACTIVE, PREVIOUS, PENDING_ROTATION)
          </p>
        </div>

        <form onSubmit={handleStore} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Store / Rotate Encrypted Secret</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Secret Key Name (e.g. STRIPE_API_SECRET_KEY)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <input
              type="password"
              required
              placeholder="Secret Plaintext Value"
              value={secretValue}
              onChange={(e) => setSecretValue(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={storeMutation.isPending}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Store Encrypted Secret
          </button>
        </form>

        {lastStored && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Secret Record #{lastStored.secretId}</span>
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm font-mono">{lastStored.keyName}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded">
                  Version {lastStored.version} ({lastStored.status})
                </span>
              </div>
              <div className="text-[10px] text-slate-500">Value: [AES-256-CBC Encrypted & Protected]</div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
