"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DetailHeader } from "@/components/shared/DetailHeader";
import { MetadataPanel } from "@/components/shared/MetadataPanel";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import { ROUTES } from "@/constants/routes";
import { Building2, ShieldCheck, CheckCircle2, XCircle, Code2, RefreshCw } from "lucide-react";

export default function MerchantDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [jsonModalData, setJsonModalData] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["merchant", id],
    queryFn: () => merchantService.getMerchantDetails(id),
    enabled: !!id,
  });

  const handleRunVerification = async () => {
    if (!id) return;
    setIsVerifying(true);
    try {
      await merchantService.verifyMerchant(id, true);
      refetch();
    } catch {
      // error handled
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton rows={8} />
      </AppLayout>
    );
  }

  if (isError || !data?.merchant) {
    return (
      <AppLayout>
        <ErrorState
          title="Merchant Not Found"
          message={`Could not locate merchant with ID: ${id}`}
          onRetry={refetch}
        />
      </AppLayout>
    );
  }

  const { merchant, verificationResult } = data;

  const metadataFields = [
    { label: "Merchant ID", value: merchant._id, copyable: true, copyText: merchant._id },
    { label: "Alias", value: merchant.alias },
    { label: "Wallet Address", value: merchant.walletAddress || merchant.address, copyable: true, copyText: merchant.walletAddress || merchant.address },
    { label: "Network", value: merchant.network },
    { label: "Verification Status", value: <StatusBadge status={merchant.verificationStatus || merchant.status} /> },
    { label: "Verification Version", value: `v${merchant.verificationVersion || 1}` },
    { label: "Last Verified", value: merchant.lastVerifiedAt ? new Date(merchant.lastVerifiedAt).toLocaleString() : "Never" },
    { label: "Verification Expiry", value: merchant.verificationExpiresAt ? new Date(merchant.verificationExpiresAt).toLocaleString() : "Never" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Detail Header */}
        <DetailHeader
          title={merchant.alias}
          subtitle={`ID: ${merchant._id}`}
          status={merchant.verificationStatus || merchant.status}
          backHref={ROUTES.MERCHANTS.LIST}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <ShieldCheck className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`} />
                <span>{isVerifying ? "Verifying..." : "Run Strategy Verification"}</span>
              </button>
              {verificationResult && (
                <button
                  onClick={() => setJsonModalData(verificationResult)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title="Inspect Verification Result JSON"
                >
                  <Code2 className="w-4 h-4" />
                </button>
              )}
            </div>
          }
        />

        {/* Metadata Panel */}
        <MetadataPanel title="Merchant Profile Telemetry" fields={metadataFields} />

        {/* Strategy Verification Results Breakdown */}
        {verificationResult?.strategies && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Verification Strategy Breakdown</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Reason: <strong className="text-cyan-400">{verificationResult.reason}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(verificationResult.strategies).map(([stratKey, strat]) => (
                <div
                  key={stratKey}
                  className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
                    strat.passed
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase">{(strat as any).strategy || stratKey}</span>
                    {strat.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">{(strat as any).reason || strat.details}</div>
                  <div className="text-[10px] text-slate-500">Score: {strat.score}/100</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Inspector Modal */}
        <JsonInspectorModal
          isOpen={!!jsonModalData}
          onClose={() => setJsonModalData(null)}
          title="Merchant Verification Telemetry Result"
          data={jsonModalData}
        />
      </div>
    </AppLayout>
  );
}
