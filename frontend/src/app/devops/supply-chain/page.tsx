"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupplyChainPage() {
  const { data: supplyChain, isLoading } = useQuery({
    queryKey: ["devops", "supply-chain", "all"],
    queryFn: devopsService.getSupplyChain,
  });

  const signatures = supplyChain?.signatures || [];
  const sboms = supplyChain?.sboms || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/devops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to DevOps Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">DevSecOps Supply Chain & Cosign Image Signatures</h1>
          </div>
          <p className="text-xs text-slate-400">
            Software Bill of Materials (SBOM) manifests and Cosign cryptographic container image signatures
          </p>
        </div>

        {/* Cosign Image Signatures */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Cosign Container Image Signatures ({signatures.length})</span>
          </h3>

          <div className="space-y-3">
            {signatures.map((s) => (
              <div key={s.signatureId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{s.imageRef}</span>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 font-bold text-[10px] rounded font-mono">
                      Alg: {s.algorithm}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Signer: {s.signerIdentity} • Signature ID: {s.signatureId}</div>
                </div>

                <StatusBadge status={s.isVerified ? "VERIFIED" : "UNVERIFIED"} />
              </div>
            ))}
          </div>
        </div>

        {/* SBOM Manifests */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Software Bill of Materials (SBOM) Manifests ({sboms.length})</span>
          </h3>

          <div className="space-y-3">
            {sboms.map((m) => (
              <div key={m.sbomId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{m.imageRef}</span>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 font-bold text-[10px] rounded font-mono">
                      Format: {m.format}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Components Analyzed: {m.componentsCount} • Vulnerabilities: {m.vulnerabilitiesFoundCount}</div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded font-sans">
                  PASSED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
