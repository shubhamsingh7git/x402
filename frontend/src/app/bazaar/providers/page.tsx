"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { bazaarService, BazaarSearchQueryParams } from "@/lib/api/services/bazaarService";
import { merchantService } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProviderListing } from "@/types";
import { Store, Plus, Eye, Trash2, Building2, Tag, Globe, Edit } from "lucide-react";
import Link from "next/link";

export default function BazaarProvidersPage() {
  const [params, setParams] = useState<BazaarSearchQueryParams>({ page: 1, limit: 10 });
  const [deleteTarget, setDeleteTarget] = useState<ProviderListing | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["bazaar", "providers", params],
    queryFn: () => bazaarService.listProviders(params),
  });

  const deleteMutation = useMutation({
    mutationFn: bazaarService.deleteProvider,
    onSuccess: () => {
      setDeleteTarget(null);
      refetch();
    },
  });

  const columns: Column<ProviderListing>[] = [
    {
      header: "Provider ID",
      accessorKey: "providerId",
      cell: (row) => (
        <div>
          <Link href={`/bazaar/providers/${row._id}`} className="font-bold text-cyan-400 hover:underline">
            {row.providerId}
          </Link>
          <div className="text-[10px] text-slate-500 font-mono">
            Merchant: {typeof row.merchantId === "string" ? row.merchantId : row.merchantId?.alias || row.merchantId?._id}
          </div>
        </div>
      ),
    },
    {
      header: "Capabilities",
      cell: (row) => (
        <div className="flex items-center gap-1 flex-wrap max-w-[220px]">
          {(row.capabilities || []).map((c) => (
            <span key={c} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Price per Call",
      cell: (row) => (
        <span className="font-mono text-emerald-400 font-bold">
          ${Number(row.pricePerCall ?? 0).toFixed(4)} {row.currency || "USD"}
        </span>
      ),
    },
    {
      header: "Supported Networks",
      cell: (row) => (
        <span className="font-mono text-slate-300 text-xs truncate max-w-[150px] inline-block">
          {(row.supportedNetworks || []).join(", ") || "Base Sepolia"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status || "ACTIVE"} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/bazaar/providers/${row._id}`}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60"
            title="View Provider SLA & Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30"
            title="Remove Provider Listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-cyan-400" />
              <span>Provider Registry Directory</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Active x402 capability providers, network support, rate structures, and availability status
            </p>
          </div>
          <Link
            href="/bazaar"
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Bazaar Overview</span>
          </Link>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Filter providers by providerId, capability, network..."
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
          emptyTitle="No Provider Listings Found"
          emptyDescription="Register provider listings in the Bazaar Overview page to populate this directory."
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Remove Provider Listing?"
          description={`Are you sure you want to remove provider listing [${deleteTarget?.providerId}] from the Bazaar registry?`}
          confirmText="Yes, Remove Provider"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
