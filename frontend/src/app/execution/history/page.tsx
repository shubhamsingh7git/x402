"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { executionService } from "@/lib/api/services/executionService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ExecutionSessionRecord } from "@/types";
import { Cpu, Eye, ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ExecutionHistoryPage() {
  const { data: history, isLoading, isError, refetch } = useQuery({
    queryKey: ["execution", "history", "all"],
    queryFn: () => executionService.getExecutionHistory(100),
  });

  const columns: Column<ExecutionSessionRecord>[] = [
    {
      header: "Session ID",
      accessorKey: "sessionId",
      cell: (row) => (
        <Link href={`/execution/${row.sessionId}`} className="font-bold text-cyan-400 hover:underline">
          {row.sessionId}
        </Link>
      ),
    },
    {
      header: "Capability",
      cell: (row) => <span className="font-bold text-white text-xs">{row.capability}</span>,
    },
    {
      header: "Strategy",
      cell: (row) => <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">{row.strategy}</span>,
    },
    {
      header: "State",
      cell: (row) => <StatusBadge status={row.state} />,
    },
    {
      header: "Attempts",
      cell: (row) => <span className="font-mono font-bold text-slate-300">{(row.attempts || []).length} attempt(s)</span>,
    },
    {
      header: "Duration",
      cell: (row) => <span className="font-mono text-purple-400 font-bold">{row.totalDurationMs} ms</span>,
    },
    {
      header: "Cost",
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">${row.totalCostUsd} USD</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Link
          href={`/execution/${row.sessionId}`}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 inline-flex items-center gap-1 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href="/execution" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Execution Overview</span>
        </Link>

        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <History className="w-6 h-6 text-cyan-400" />
              <span>Multi-Provider Execution Audit Trail</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Persisted MongoDB session history: State machine logs, attempts, failovers, and consensus resolution
            </p>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={Array.isArray(history) ? history : []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Filter execution sessions by sessionId, capability, strategy..."
          emptyTitle="No Execution Sessions Persisted"
          emptyDescription="Run test multi-provider executions in the Execution Engine page to populate this audit log."
        />
      </div>
    </AppLayout>
  );
}
