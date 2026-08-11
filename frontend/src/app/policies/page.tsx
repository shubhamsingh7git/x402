"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { policyService } from "@/lib/api/services/policyService";
import { merchantService } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SpendPolicy } from "@/types";
import { ShieldCheck, Zap, AlertOctagon, Plus, ToggleLeft, ToggleRight, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PoliciesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [killSwitchTarget, setKillSwitchTarget] = useState<SpendPolicy | null>(null);

  // New Policy Form State
  const [merchantId, setMerchantId] = useState("");
  const [dailyBudget, setDailyBudget] = useState(10);
  const [txLimit, setTxLimit] = useState(0.05);
  const [maxTxPerMin, setMaxTxPerMin] = useState(30);

  const { data: policiesData, isLoading, refetch } = useQuery({
    queryKey: ["policies"],
    queryFn: () => policyService.listPolicies(),
  });

  const { data: merchantsData } = useQuery({
    queryKey: ["merchants", "select"],
    queryFn: () => merchantService.listMerchants({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: policyService.createPolicy,
    onSuccess: () => {
      setIsCreateOpen(false);
      refetch();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      policyService.togglePolicy(id, isEnabled),
    onSuccess: () => refetch(),
  });

  const killSwitchMutation = useMutation({
    mutationFn: ({ id, killSwitch }: { id: string; killSwitch: boolean }) =>
      policyService.toggleKillSwitch(id, killSwitch),
    onSuccess: () => {
      setKillSwitchTarget(null);
      refetch();
    },
  });

  const policies = policiesData?.data || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>Spend Policy Guardrails</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Autonomous Fiduciary Governance: Daily budgets, transaction caps, velocity caps, and emergency kill switches
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="default"
            className="gap-2 font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Create Policy</span>
          </Button>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p) => (
            <div
              key={p._id}
              className={`p-6 bg-slate-900/60 border rounded-2xl backdrop-blur-md space-y-4 font-mono text-xs transition-all ${
                p.killSwitch
                  ? "border-rose-500/50 bg-rose-950/10"
                  : p.isEnabled
                  ? "border-slate-800 hover:border-amber-500/40"
                  : "border-slate-800/40 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{p.merchantAlias || `Merchant #${p.merchantId}`}</h3>
                  <div className="text-[10px] text-slate-500">Policy Version v{p.version || 1}</div>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: p._id, isEnabled: !p.isEnabled })}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title="Toggle Policy Enable Status"
                >
                  {p.isEnabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-600" />
                  )}
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Daily Budget:</span>
                  <span className="font-bold text-emerald-400">${Number(p.dailyBudget ?? 0).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Limit per Transaction:</span>
                  <span className="font-bold text-cyan-400">${Number(p.transactionLimit ?? 0).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Velocity (Max Tx/Min):</span>
                  <span className="font-bold text-purple-400">{p.maxTxPerMinute} tx/min</span>
                </div>
              </div>

              {/* Kill Switch Controls */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <AlertOctagon className={`w-4 h-4 ${p.killSwitch ? "text-rose-400 animate-pulse" : "text-slate-500"}`} />
                  <span className={p.killSwitch ? "text-rose-400 font-bold" : "text-slate-500"}>
                    {p.killSwitch ? "KILL SWITCH ACTIVE" : "Kill Switch Normal"}
                  </span>
                </div>
                <Button
                  onClick={() => setKillSwitchTarget(p)}
                  variant={p.killSwitch ? "success" : "destructive"}
                  size="sm"
                  className="text-[11px]"
                >
                  {p.killSwitch ? "Deactivate" : "Activate Kill Switch"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Policy Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Create Spend Guardrail Policy</span>
              </h3>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Merchant *</label>
                  <select
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="">-- Select Merchant --</option>
                    {(Array.isArray(merchantsData?.data) ? merchantsData.data : []).map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.alias} ({m._id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Daily Budget Limit ($ USD)</label>
                  <input
                    type="number"
                    step="1"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Limit per Single Tx ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={txLimit}
                    onChange={(e) => setTxLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Transactions / Minute</label>
                  <input
                    type="number"
                    value={maxTxPerMin}
                    onChange={(e) => setMaxTxPerMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <Button
                  onClick={() => setIsCreateOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    createMutation.mutate({
                      merchantId,
                      dailyBudget,
                      transactionLimit: txLimit,
                      maxTxPerMinute: maxTxPerMin,
                    })
                  }
                  disabled={!merchantId || createMutation.isPending}
                  variant="default"
                  size="sm"
                >
                  {createMutation.isPending ? "Creating..." : "Save Policy"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Kill Switch Modal */}
        <ConfirmModal
          isOpen={!!killSwitchTarget}
          onClose={() => setKillSwitchTarget(null)}
          onConfirm={() =>
            killSwitchTarget &&
            killSwitchMutation.mutate({
              id: killSwitchTarget._id,
              killSwitch: !killSwitchTarget.killSwitch,
            })
          }
          title={killSwitchTarget?.killSwitch ? "Deactivate Kill Switch?" : "ACTIVATE EMERGENCY KILL SWITCH?"}
          description={
            killSwitchTarget?.killSwitch
              ? `Re-enable automated transaction processing for [${killSwitchTarget.merchantAlias}]?`
              : `STRICT WARNING: Activating the Kill Switch will IMMEDIATELY DENY all transaction attempts for merchant [${killSwitchTarget?.merchantAlias}] regardless of available budget.`
          }
          confirmText={killSwitchTarget?.killSwitch ? "Deactivate Kill Switch" : "ACTIVATE EMERGENCY KILL SWITCH"}
          isDanger={!killSwitchTarget?.killSwitch}
          isLoading={killSwitchMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
