"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { merchantService, MerchantFilterParams } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CopyButton } from "@/components/ui/CopyButton";
import { Merchant } from "@/types";
import { Building2, Plus, ShieldCheck, Trash2, Eye, RefreshCw, X, Check } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";

export default function MerchantsPage() {
  const [params, setParams] = useState<MerchantFilterParams>({ page: 1, limit: 10 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Merchant | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Create Form State
  const [newAlias, setNewAlias] = useState("");
  const [newWallet, setNewWallet] = useState("");
  const [newNetwork, setNewNetwork] = useState("Base Sepolia Testnet");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["merchants", params],
    queryFn: () => merchantService.listMerchants(params),
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: merchantService.createMerchant,
    onSuccess: (newMerchant) => {
      showToast(`Merchant [${newMerchant.alias}] created successfully with PENDING status!`);
      setIsCreateOpen(false);
      setNewAlias("");
      setNewWallet("");
      refetch();
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Failed to create merchant", "error");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: merchantService.deleteMerchant,
    onSuccess: () => {
      showToast("Merchant deleted successfully!");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Failed to delete merchant", "error");
    },
  });

  // Manual Verify Handler
  const handleVerify = async (merchant: Merchant) => {
    setVerifyingId(merchant._id);
    try {
      const res = await merchantService.verifyMerchant(merchant._id, true);
      showToast(`Verification completed for [${merchant.alias}]. Result: ${res.verified ? "VERIFIED" : "FAILED"}`);
      refetch();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Verification failed", "error");
    } finally {
      setVerifyingId(null);
    }
  };

  const columns: Column<Merchant>[] = [
    {
      header: "Merchant Alias",
      accessorKey: "alias",
      cell: (row) => (
        <Link href={ROUTES.MERCHANTS.DETAILS(row._id)} className="font-bold text-cyan-400 hover:underline">
          {row.alias}
        </Link>
      ),
    },
    {
      header: "Wallet Address",
      accessorKey: "walletAddress",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-300 truncate max-w-[150px]">{row.walletAddress || row.address}</span>
          <CopyButton text={row.walletAddress || row.address || ""} />
        </div>
      ),
    },
    {
      header: "Network",
      accessorKey: "network",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status || row.verificationStatus || "Pending"} />,
    },
    {
      header: "Last Verified",
      cell: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {row.lastVerifiedAt ? new Date(row.lastVerifiedAt).toLocaleString() : "Never"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleVerify(row)}
            disabled={verifyingId === row._id}
            variant="success"
            size="sm"
            title="Run Strategy Verification"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifyingId === row._id ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Verify</span>
          </Button>
          <Link
            href={ROUTES.MERCHANTS.DETAILS(row._id)}
            className="p-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg border border-border inline-flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <Button
            onClick={() => setDeleteTarget(row)}
            variant="destructive"
            size="icon-sm"
            title="Delete Merchant"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMsg && (
          <div
            className={`fixed top-20 right-6 z-50 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl font-mono text-xs flex items-center gap-3 animate-in slide-in-from-top-4 ${
              toastMsg.type === "success"
                ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                : "bg-rose-950/80 border-rose-800 text-rose-300"
            }`}
          >
            {toastMsg.type === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" />
              <span>Merchant Registry Management</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Manage registered x402 payment merchants, strategy verification statuses, and trust rules
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="default"
            className="gap-2 font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Create Merchant</span>
          </Button>
        </div>

        {/* Filters & Data Table */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Search merchants by alias, wallet..."
          onSearchChange={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
          pagination={
            data?.pagination
              ? {
                  page: data.pagination.page,
                  limit: data.pagination.limit,
                  total: data.pagination.total,
                  totalPages: data.pagination.totalPages,
                  onPageChange: (p) => setParams((prev) => ({ ...prev, page: p })),
                }
              : undefined
          }
          emptyTitle="No Merchants Registered"
          emptyDescription="Click 'Create Merchant' to add a new merchant to the verification engine."
        />

        {/* Create Merchant Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>Register New Merchant</span>
                </h3>
                <Button variant="ghost" size="icon-xs" onClick={() => setIsCreateOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Merchant Alias *</label>
                  <input
                    type="text"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    placeholder="e.g. OpenAI API Services"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Wallet Address *</label>
                  <input
                    type="text"
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    placeholder="e.g. 0x7F2A8492B1039E82C41A3B92..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Blockchain Network</label>
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Base Sepolia Testnet">Base Sepolia Testnet</option>
                    <option value="Algorand TestNet">Algorand TestNet</option>
                    <option value="Solana Devnet">Solana Devnet</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                  ⚠️ Note: New merchants are automatically registered with status <strong>PENDING</strong> and must pass strategy verification before accepting live payments.
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
                  onClick={() => createMutation.mutate({ alias: newAlias, walletAddress: newWallet, network: newNetwork })}
                  disabled={!newAlias || !newWallet || createMutation.isPending}
                  variant="success"
                  size="sm"
                >
                  {createMutation.isPending ? "Registering..." : "Register Merchant"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Soft Delete Merchant?"
          description={`Are you sure you want to soft delete merchant [${deleteTarget?.alias}]? This action will set its status to DELETED.`}
          confirmText="Yes, Delete Merchant"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
