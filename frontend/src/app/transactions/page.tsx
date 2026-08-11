"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionService, TransactionFilterParams } from "@/lib/api/services/transactionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import { Transaction } from "@/types";
import { CreditCard, Eye, ShieldCheck, FileText, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [params, setParams] = useState<TransactionFilterParams>({ page: 1, limit: 10 });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [jsonModalData, setJsonModalData] = useState<any | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionService.listTransactions(params),
  });

  const columns: Column<Transaction>[] = [
    {
      header: "Transaction ID / Hash",
      accessorKey: "txHash",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-bold truncate max-w-[140px]">{row.txHash || row._id}</span>
          <CopyButton text={row.txHash || row._id} />
        </div>
      ),
    },
    {
      header: "Merchant",
      accessorKey: "merchant",
      cell: (row) => (
        <span className="font-bold text-white">
          {typeof row.merchant === "string" ? row.merchant : row.merchant?.alias || row.merchant?.name || "Merchant"}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-400">
          ${Number(row.amount ?? 0).toFixed(4)} {row.currency || "USDC"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Policy Decision",
      accessorKey: "policyDecision",
      cell: (row) => (
        <span className="text-xs font-mono text-slate-300">
          {typeof row.policyDecision === "string" ? row.policyDecision : row.policyDecision?.reason || (row.policyDecision?.passed ? "Passed" : "Approved")}
        </span>
      ),
    },
    {
      header: "Timestamp",
      cell: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {row.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          onClick={() => setSelectedTx(row)}
          variant="outline"
          size="icon-sm"
          title="Inspect Policy & Receipt Details"
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <span>x402 Micro-Transaction Ledger</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Complete audit trail of agent payments, policy approvals, on-chain hashes, and settlement states
            </p>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Search by merchant, txHash, status..."
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
          emptyTitle="No Transactions Recorded"
          emptyDescription="Transactions will appear here automatically when autonomous research runs settle x402 payments."
        />

        {/* Transaction Detail Drawer Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-xl glass-card-static rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-foreground font-mono">Transaction Telemetry</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTx(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 inner-box">
                  <div className="text-[10px] text-muted-foreground uppercase">Transaction Hash</div>
                  <div className="text-primary font-bold truncate mt-1">{selectedTx.txHash}</div>
                </div>

                <div className="p-3 inner-box">
                  <div className="text-[10px] text-muted-foreground uppercase">Merchant</div>
                  <div className="text-foreground font-bold mt-1">
                    {typeof selectedTx.merchant === "string"
                      ? selectedTx.merchant
                      : selectedTx.merchant?.alias || selectedTx.merchant?.name || "Merchant"}
                  </div>
                </div>

                <div className="p-3 inner-box">
                  <div className="text-[10px] text-muted-foreground uppercase">Amount</div>
                  <div className="text-emerald-500 font-bold mt-1">${selectedTx.amount} USDC</div>
                </div>

                <div className="p-3 inner-box">
                  <div className="text-[10px] text-muted-foreground uppercase">Status</div>
                  <div className="mt-1"><StatusBadge status={selectedTx.status} /></div>
                </div>
              </div>

              {/* Policy Snapshot */}
              {selectedTx.policySnapshot && (
                <div className="p-4 inner-box rounded-2xl space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-purple-500 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Spend Policy Snapshot Evaluated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-foreground text-[11px]">
                    <div>Limit per Tx: ${selectedTx.policySnapshot.transactionLimit}</div>
                    <div>Daily Budget: ${selectedTx.policySnapshot.dailyBudget}</div>
                    <div>Max Tx/Min: {selectedTx.policySnapshot.maxTxPerMinute}</div>
                    <div>Kill Switch: {selectedTx.policySnapshot.killSwitch ? "ACTIVE" : "OFF"}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button
                  onClick={() => setJsonModalData(selectedTx)}
                  variant="outline"
                  size="sm"
                  className="gap-2 font-mono"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Raw JSON Payload</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <JsonInspectorModal
          isOpen={!!jsonModalData}
          onClose={() => setJsonModalData(null)}
          title="Raw Transaction Record JSON"
          data={jsonModalData}
        />
      </div>
    </AppLayout>
  );
}
