"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AgentProfileRecord } from "@/types";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AgentRegistryPage() {
  const { data: agents, isLoading, isError, refetch } = useQuery({
    queryKey: ["agents", "registry", "all"],
    queryFn: agentService.getRegistry,
  });

  const columns: Column<AgentProfileRecord>[] = [
    {
      header: "Agent ID",
      accessorKey: "agentId",
      cell: (row) => <span className="font-bold text-cyan-400">{row.agentId}</span>,
    },
    {
      header: "Agent Name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.agentName}</span>,
    },
    {
      header: "Role",
      cell: (row) => <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded">{row.role}</span>,
    },
    {
      header: "Capabilities",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.capabilities || []).map((c) => (
            <span key={c} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Confidence Score",
      cell: (row) => <span className="font-bold text-emerald-400">{Math.round(row.confidenceScore * 100)}%</span>,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/agents" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Specialized Agent Registry Roster</h1>
          </div>
          <p className="text-xs text-slate-400">
            Registered autonomous agents declaring specialized roles, capability coverage, SLA latencies, and confidence scores
          </p>
        </div>

        <DataTable
          columns={columns}
          data={agents || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Filter agents by ID, role, or capability..."
          emptyTitle="No Agents Registered"
          emptyDescription="Seed or register specialized agents to populate the registry."
        />
      </div>
    </AppLayout>
  );
}
