"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditService, AuditFilterParams } from "@/lib/api/services/auditService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JsonInspectorModal } from "@/components/shared/JsonInspectorModal";
import { AuditLog } from "@/types";
import { FileText, Eye, User, ShieldCheck } from "lucide-react";

export default function AuditPage() {
  const [params, setParams] = useState<AuditFilterParams>({ page: 1, limit: 15 });
  const [inspectData, setInspectData] = useState<any | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["audit", params],
    queryFn: () => auditService.listAuditLogs(params),
  });

  const columns: Column<AuditLog>[] = [
    {
      header: "Action Event",
      accessorKey: "action",
      cell: (row) => <StatusBadge status={row.action} />,
    },
    {
      header: "User Attribution",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-white text-xs">{row.userName || row.userId || "System Engine"}</span>
        </div>
      ),
    },
    {
      header: "Merchant Target",
      cell: (row) => (
        <span className="font-mono text-slate-300 text-xs">{row.merchantAlias || row.merchantId || "Platform Global"}</span>
      ),
    },
    {
      header: "IP / User Agent",
      cell: (row) => (
        <span className="font-mono text-slate-500 text-[11px] truncate max-w-[140px] inline-block">
          {row.ipAddress || "127.0.0.1"}
        </span>
      ),
    },
    {
      header: "Timestamp",
      cell: (row) => (
        <span className="font-mono text-slate-400 text-[11px]">
          {row.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Metadata",
      cell: (row) => (
        <button
          onClick={() => setInspectData(row.metadata || row)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 font-mono text-xs flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </button>
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
              <FileText className="w-6 h-6 text-cyan-400" />
              <span>Enterprise Compliance Audit Log</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Immutable security audit history, user actions, strategy verification logs, and system events
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
          searchPlaceholder="Filter audit events by action, user, merchant..."
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
          emptyTitle="No Audit Logs Recorded"
          emptyDescription="Audit records will be generated automatically as users and background jobs interact with the platform."
        />

        {/* JSON Inspector Modal */}
        <JsonInspectorModal
          isOpen={!!inspectData}
          onClose={() => setInspectData(null)}
          title="Audit Record Telemetry & Metadata"
          data={inspectData}
        />
      </div>
    </AppLayout>
  );
}
