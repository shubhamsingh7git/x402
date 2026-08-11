"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShieldCheck, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function HumanApprovalsPage() {
  const { data: approvals, isLoading, isError, refetch } = useQuery({
    queryKey: ["agents", "approvals", "all"],
    queryFn: agentService.getApprovals,
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "APPROVE" | "REJECT" }) =>
      agentService.processApprovalAction(id, action),
    onSuccess: () => refetch(),
  });

  const approvalList = approvals || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/agents" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Human Approval Governance Gate</h1>
          </div>
          <p className="text-xs text-slate-400">
            Pending and historical human approval requests for high-risk capabilities and high-value payments
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Human Approval Requests Feed</span>
          </h3>

          <div className="space-y-3">
            {approvalList.length > 0 ? (
              approvalList.map((appr) => (
                <div key={appr.approvalId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-sans">{appr.capability}</span>
                      <StatusBadge status={appr.status} />
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded font-bold">
                        Risk Score: {appr.riskScore} / 100
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans">{appr.reason}</p>
                    <div className="text-[10px] text-slate-500">ID: {appr.approvalId} • Session: {appr.sessionId}</div>
                  </div>

                  {appr.status === "WAITING_APPROVAL" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => actionMutation.mutate({ id: appr.approvalId, action: "APPROVE" })}
                        disabled={actionMutation.isPending}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => actionMutation.mutate({ id: appr.approvalId, action: "REJECT" })}
                        disabled={actionMutation.isPending}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">No pending human approval requests</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
