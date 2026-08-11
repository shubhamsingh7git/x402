"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/services/dashboardService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Building2,
  CreditCard,
  TrendingUp,
  DollarSign,
  Bot,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });

  const {
    data: charts,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: dashboardService.getCharts,
  });

  const isLoading = isLoadingSummary || isLoadingCharts;
  const isError = isErrorSummary || isErrorCharts;

  const COLORS = ["#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

  // Safely extract total merchants count
  const merchantCount = summary?.merchantCount ?? summary?.merchants?.total ?? 0;
  const verifiedMerchants = summary?.merchants?.verified ?? (summary?.merchantCount ? summary.merchantCount : 0);
  const pendingMerchants = summary?.merchants?.pending ?? 0;

  // Safely extract spend metrics
  const todaysSpend = summary?.todaysSpend ?? summary?.transactions?.todayAmount ?? summary?.budget?.spentToday ?? 0;
  const totalSpend = summary?.totalSpend ?? summary?.budget?.allocated ?? 0;
  const approvedTxCount = summary?.approvedTransactions ?? summary?.transactions?.todayCount ?? 0;
  const deniedTxCount = summary?.deniedTransactions ?? 0;
  const averageTxAmount = summary?.averageTransactionAmount ?? 0;
  const successRate = charts?.approvalRatio ?? summary?.transactions?.successRate ?? 100;
  const activePolicies = summary?.activePolicies ?? 0;

  // Prepare chart series safely
  const transactionVolumeData =
    charts?.dailySpend?.map((d) => ({
      timestamp: d.date,
      amount: d.spend,
      count: d.count,
    })) ??
    charts?.transactionVolume ??
    [];

  const merchantStatusData =
    charts?.merchantDistribution?.map((m) => ({
      status: m.merchant || "Active Merchant",
      count: m.count,
    })) ??
    charts?.merchantStatusDistribution ??
    [];

  // Prepare activity list safely
  const activityList =
    summary?.recentActivity ??
    (summary?.latestActivity
      ? [
          {
            type: summary.latestActivity.action,
            description: `Audit Event: ${summary.latestActivity.action}`,
            timestamp: summary.latestActivity.timestamp,
            status: "VERIFIED",
          },
        ]
      : []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card-static rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <span>Platform Executive Dashboard</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Real-time analytics, merchant verification, transaction metrics, and budget telemetry
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="px-3 py-1 bg-background border border-border rounded-full shadow-xs">
              Backend Mode: <strong className="text-primary">RC1.1</strong>
            </span>
          </div>
        </div>

        {isError && (
          <ErrorState
            title="Dashboard telemetry offline"
            message="Could not connect to backend server on http://localhost:5000/api/v1/dashboard/overview"
            onRetry={() => {
              refetchSummary();
              refetchCharts();
            }}
          />
        )}

        {isLoading ? (
          <LoadingSkeleton rows={8} />
        ) : summary ? (
          <>
            {/* Top Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Total Merchants</span>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{merchantCount}</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="text-emerald-500 font-bold">{verifiedMerchants} Verified</span>
                  <span>•</span>
                  <span className="text-amber-500">{pendingMerchants} Pending</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Today&apos;s Spend</span>
                  <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-500">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">${Number(todaysSpend ?? 0).toFixed(2)}</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary font-bold">{approvedTxCount} Approved</span>
                  <span>•</span>
                  <span className="text-rose-500">{deniedTxCount} Denied</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Total Platform Spend</span>
                  <div className="p-2 bg-primary/10 border border-primary/30 rounded-xl text-primary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">${Number(totalSpend ?? 0).toFixed(2)}</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="text-primary font-bold">{activePolicies} Active Policies</span>
                  <span>•</span>
                  <span>Avg ${Number(averageTxAmount ?? 0).toFixed(2)}/tx</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Approval Success Rate</span>
                  <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{successRate}%</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="text-emerald-500 font-bold">100% Policy Guard</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            {charts && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
                {/* Transaction Volume Area Chart */}
                <div className="lg:col-span-2 p-6 glass-card-static rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Daily Spend Volume Telemetry</h3>
                      <p className="text-xs text-muted-foreground">30-day aggregated transaction volume ($ USD)</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    {transactionVolumeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={transactionVolumeData}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} fontStyle="mono" />
                          <YAxis stroke="#64748b" fontSize={10} fontStyle="mono" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border-stark)", borderRadius: "12px", fontSize: "12px" }}
                          />
                          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No transaction volume recorded yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Merchant Distribution Pie Chart */}
                <div className="p-6 glass-card-static rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Merchant Spend Allocation</h3>
                    <p className="text-xs text-muted-foreground">Distribution across active providers</p>
                  </div>
                  <div className="h-48 w-full">
                    {merchantStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={merchantStatusData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            innerRadius={40}
                            paddingAngle={4}
                          >
                            {merchantStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border-stark)", borderRadius: "12px", fontSize: "12px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No merchant distribution available
                      </div>
                    )}
                  </div>
                  {merchantStatusData.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {merchantStatusData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 truncate">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-foreground truncate">{item.status}: {item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Activity Feed */}
            <div className="p-6 glass-card-static rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Live Activity Stream</h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Real-time Socket.IO feed</span>
              </div>
              <div className="divide-y divide-border/60">
                {activityList.length > 0 ? (
                  activityList.map((act, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={act.status || "VERIFIED"} />
                        <span className="text-foreground">{act.description || act.type}</span>
                      </div>
                      <span className="text-muted-foreground text-[11px]">
                        {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs font-mono text-muted-foreground">
                    No recent audit activity recorded yet.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
