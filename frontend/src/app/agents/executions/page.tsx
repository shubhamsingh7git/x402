"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { agentService } from "@/lib/api/services/agentService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AgentExecutionPlanRecord } from "@/types";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AgentExecutionsPage() {
  const { data: executions, isLoading, isError, refetch } = useQuery({
    queryKey: ["agents", "executions", "all"],
    queryFn: () => agentService.getExecutions(50),
  });

  const columns: Column<AgentExecutionPlanRecord>[] = [
    {
      header: "Session ID",
      accessorKey: "sessionId",
      cell: (row) => <span className="font-bold text-cyan-400">{row.sessionId}</span>,
    },
    {
      header: "Prompt Goal",
      cell: (row) => <span className="text-white text-xs font-sans truncate max-w-xs block">{row.prompt}</span>,
    },
    {
      header: "Task Graph",
      cell: (row) => <span className="font-mono text-purple-400 font-bold">{(row.taskGraph || []).length} subtask(s)</span>,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Duration",
      cell: (row) => <span className="font-mono text-purple-400 font-bold">{row.totalDurationMs} ms</span>,
    },
    {
      header: "Cost",
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">${row.totalCostUsd} USD</span>,
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Agent Orchestration Sessions</h1>
          </div>
          <p className="text-xs text-slate-400">
            Decomposed subtask graphs, inter-agent routing decisions, and execution sessions
          </p>
        </div>

        <DataTable
          columns={columns}
          data={executions || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Filter sessions by sessionId or prompt..."
          emptyTitle="No Multi-Agent Sessions Recorded"
          emptyDescription="Trigger multi-agent task collaboration from the Agent Control Center page."
        />
      </div>
    </AppLayout>
  );
}
