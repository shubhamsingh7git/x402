"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/services/dashboardService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const { data: charts, isLoading, isError, refetch } = useQuery({
    queryKey: ["analytics", "charts"],
    queryFn: dashboardService.getCharts,
  });

  const COLORS = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <LineChartIcon className="w-6 h-6 text-cyan-400" />
              <span>Platform Intelligence & Deep Analytics</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Cross-network transaction metrics, verification success rates, and protocol settlement performance
            </p>
          </div>
        </div>

        {isError && <ErrorState title="Analytics Feed Offline" onRetry={refetch} />}

        {isLoading ? (
          <LoadingSkeleton rows={6} />
        ) : charts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Volume Bar Chart */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>24-Hour Settlement Volume ($ USD)</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.transactionVolume}>
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <YAxis stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Bar dataKey="amount" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Budget Usage Line Chart */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Daily Fiduciary Budget Velocity</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.budgetUsageHistory}>
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <YAxis stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Line type="monotone" dataKey="spent" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                    <Line type="monotone" dataKey="limit" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Network Distribution */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <span>Blockchain Network Allocation</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.networkDistribution || []}
                      dataKey="count"
                      nameKey="network"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.network || entry.name}: ${entry.count || entry.value}`}
                    >
                      {(charts.networkDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verification Strategy Status Allocation */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Merchant Verification Distribution</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.merchantStatusDistribution || []}>
                    <XAxis dataKey="status" stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <YAxis stroke="#64748b" fontSize={10} fontStyle="mono" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
