"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Users, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SessionsPage() {
  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["security", "sessions", "all"],
    queryFn: securityService.getSessions,
  });

  const revokeMutation = useMutation({
    mutationFn: securityService.revokeSession,
    onSuccess: () => refetch(),
  });

  const sessionList = sessions || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Active Authenticated Sessions & Zero Trust Revocation</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Real-time active user sessions, MFA verification status, IP addresses, and instant session revocation
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Active Sessions ({sessionList.length})</span>
          </h3>

          <div className="space-y-3">
            {sessionList.map((s) => (
              <div key={s.sessionId} className="p-4 inner-box flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{s.userId}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded font-mono">
                      {s.ipAddress}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{s.userAgent} • Session ID: {s.sessionId}</div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  {s.status === "ACTIVE" && (
                    <button
                      onClick={() => revokeMutation.mutate(s.sessionId)}
                      disabled={revokeMutation.isPending}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      title="Revoke Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
