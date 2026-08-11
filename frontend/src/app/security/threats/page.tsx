"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ThreatsPage() {
  const { data: threats, isLoading } = useQuery({
    queryKey: ["security", "threats", "all"],
    queryFn: securityService.getThreats,
  });

  const threatList = threats || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">SIEM Threat Detection Stream</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Real-time threat detection (credential abuse, suspicious IP logins, API rate limit abuse)
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Threat Events Stream ({threatList.length})</span>
          </h3>

          <div className="space-y-3">
            {threatList.map((t) => (
              <div key={t.threatId} className="p-4 inner-box flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{t.threatType}</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-bold text-[10px] rounded font-mono">
                      IP: {t.ipAddress}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{t.description} • ID: {t.threatId}</div>
                </div>

                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
