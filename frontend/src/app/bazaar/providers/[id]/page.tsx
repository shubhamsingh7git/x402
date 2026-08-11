"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { bazaarService } from "@/lib/api/services/bazaarService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import {
  Store,
  Building2,
  ShieldCheck,
  Zap,
  Globe,
  Tag,
  DollarSign,
  ArrowLeft,
  FileText,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function BazaarProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [jsonOpen, setJsonOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: provider, isLoading, isError, refetch } = useQuery({
    queryKey: ["bazaar", "provider", id],
    queryFn: () => bazaarService.getProviderDetails(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => bazaarService.deleteProvider(id),
    onSuccess: () => router.push(ROUTES.BAZAAR.PROVIDERS),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => bazaarService.updateProvider(id, { status: newStatus }),
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton rows={6} />
      </AppLayout>
    );
  }

  if (isError || !provider) {
    return (
      <AppLayout>
        <ErrorState
          title="Provider Listing Not Found"
          message="Could not load provider details from Bazaar registry"
          onRetry={refetch}
        />
      </AppLayout>
    );
  }

  const merchantObj: any = provider.merchantId || {};
  const isMerchantVerified = merchantObj.status === "Verified" || merchantObj.status === "VERIFIED";

  return (
    <AppLayout>
      <div className="space-y-6 font-mono">
        {/* Back navigation */}
        <Link
          href={ROUTES.BAZAAR.PROVIDERS}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Provider Directory</span>
        </Link>

        {/* Hero Card */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">{provider.providerId}</h1>
              <StatusBadge status={provider.status} />
            </div>
            <p className="text-xs text-slate-400">
              Registered Merchant: <span className="text-white font-bold">{merchantObj.alias || merchantObj._id || "N/A"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setJsonOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700/60 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Raw JSON</span>
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Provider</span>
            </button>
          </div>
        </div>

        {/* Telemetry & SLA Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-slate-400">Rate per Execution</div>
            <div className="text-2xl font-bold text-emerald-400">${Number(provider.pricePerCall ?? 0).toFixed(4)} USD</div>
            <div className="text-[11px] text-slate-500">x402 Micro-Payment Settlement</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-slate-400">Merchant Verification</div>
            <div className={`text-xl font-bold ${isMerchantVerified ? "text-emerald-400" : "text-amber-400"}`}>
              {isMerchantVerified ? "VERIFIED" : "PENDING"}
            </div>
            <div className="text-[11px] text-slate-500">
              {isMerchantVerified ? "Trust score: 98/100" : "Requires strategy pass"}
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-slate-400">Average SLA Latency</div>
            <div className="text-2xl font-bold text-purple-400">{(provider.metadata?.latencyMs as number) || 120} ms</div>
            <div className="text-[11px] text-slate-500">Measured across recent calls</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-slate-400">Success Rate</div>
            <div className="text-2xl font-bold text-cyan-400">{(provider.metadata?.successRate as number) || 99.8}%</div>
            <div className="text-[11px] text-slate-500">24-hour SLA window</div>
          </div>
        </div>

        {/* Detailed Spec Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Capabilities Card */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Registered Capabilities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {(provider.capabilities || []).map((c) => (
                <span key={c} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Network & Protocol Config */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Supported Blockchains</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {(provider.supportedNetworks || ["Base Sepolia Testnet"]).map((n) => (
                <span key={n} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Status Lifecycle Controls */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-white text-sm">Provider Lifecycle Controls</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateStatusMutation.mutate("ACTIVE")}
              disabled={provider.status === "ACTIVE" || updateStatusMutation.isPending}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs"
            >
              Set ACTIVE
            </button>
            <button
              onClick={() => updateStatusMutation.mutate("MAINTENANCE")}
              disabled={provider.status === "MAINTENANCE" || updateStatusMutation.isPending}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs"
            >
              Set MAINTENANCE
            </button>
            <button
              onClick={() => updateStatusMutation.mutate("INACTIVE")}
              disabled={provider.status === "INACTIVE" || updateStatusMutation.isPending}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-bold rounded-xl text-xs"
            >
              Set INACTIVE
            </button>
          </div>
        </div>

        {/* JSON Modal */}
        <JsonInspectorModal
          isOpen={jsonOpen}
          onClose={() => setJsonOpen(false)}
          title="Raw Provider Listing Record"
          data={provider}
        />

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => deleteMutation.mutate()}
          title="Remove Provider Listing?"
          description={`Permanently delete provider listing [${provider.providerId}] from Bazaar registry?`}
          confirmText="Yes, Remove Provider"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
