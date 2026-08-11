"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { healthService } from "@/lib/api/services/healthService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Activity, Database, Wallet, Bot, Cpu, Wifi, Server, CheckCircle2 } from "lucide-react";

export default function HealthPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: healthService.getHealth,
    refetchInterval: 10000,
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span>Infrastructure Diagnostics & System Health</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Live status telemetry of MongoDB, Algorand Wallet, Payment Provider, Merchant Verification Job, and Messaging
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-medium rounded-xl flex items-center gap-2 border border-slate-700"
          >
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        {isError && <ErrorState title="Health Endpoint Error" onRetry={refetch} />}

        {isLoading ? (
          <LoadingSkeleton rows={6} />
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {/* System Version & Environment */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Platform Core Status</h3>
                  <div className="text-[11px] text-emerald-400 font-bold">{data.status}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">API Version:</span>
                  <span className="font-bold text-white">{data.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Environment:</span>
                  <span className="text-cyan-400">{data.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uptime:</span>
                  <span className="text-white">{data.uptimeSeconds}s</span>
                </div>
              </div>
            </div>

            {/* MongoDB Database */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">MongoDB Cluster</h3>
                  <div className="text-[11px] text-cyan-400 font-bold">{data.subsystems.database.status}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-400 truncate">Host: {data.subsystems.database.host}</div>
                <div className="text-[11px] text-slate-400">Target Database: <strong className="text-cyan-400">x402</strong></div>
              </div>
            </div>

            {/* Algorand Wallet Subsystem */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Algorand Wallet</h3>
                  <div className="text-[11px] text-purple-400 font-bold">
                    {data.subsystems.algorandWallet.initialized ? "INITIALIZED" : "OFFLINE"}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-400 truncate">Address: {data.subsystems.algorandWallet.address}</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">USDC Balance:</span>
                  <span className="font-bold text-emerald-400">${data.subsystems.algorandWallet.usdcBalance}</span>
                </div>
              </div>
            </div>

            {/* Merchant Verification Telemetry */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Verification Scheduler</h3>
                  <div className="text-[11px] text-amber-400 font-bold">5-Min Cron Job Active</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div>Verified: <strong className="text-emerald-400">{data.merchantVerification.verified}</strong></div>
                <div>Pending: <strong className="text-amber-400">{data.merchantVerification.pending}</strong></div>
                <div>Suspended: <strong className="text-orange-400">{data.merchantVerification.suspended}</strong></div>
                <div>Blocked: <strong className="text-rose-400">{data.merchantVerification.blocked}</strong></div>
              </div>
            </div>

            {/* AI Engine */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Engine</h3>
                  <div className="text-[11px] text-blue-400 font-bold">{data.subsystems.ai.status}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div>Provider: {data.subsystems.ai.provider}</div>
                <div>Model: <strong className="text-cyan-400">{data.subsystems.ai.model}</strong></div>
              </div>
            </div>

            {/* Messaging Bus */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Messaging Subsystem</h3>
                  <div className="text-[11px] text-teal-400 font-bold">Active</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div>EventBus: {data.subsystems.messaging.eventBus}</div>
                <div>Socket.IO: {data.subsystems.messaging.socketIO}</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
