"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  ShieldCheck,
  Key,
  Users,
  Shield,
  FileCheck,
  AlertTriangle,
  Flame,
  FileText,
  Smartphone,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SecurityOverviewPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ["security", "health"],
    queryFn: securityService.getHealth,
  });

  const { data: sessions } = useQuery({
    queryKey: ["security", "sessions"],
    queryFn: securityService.getSessions,
  });

  const { data: threats } = useQuery({
    queryKey: ["security", "threats"],
    queryFn: securityService.getThreats,
  });

  const rotateKeyMutation = useMutation({
    mutationFn: securityService.rotateKeys,
  });

  const sessionList = sessions || [];
  const threatList = threats || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 font-sans">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>Enterprise Zero Trust Security & Compliance</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Zero Trust architecture, PEP/PDP policy enforcement, MFA, AES-256-GCM KMS key rotation, SIEM threat detection & regulatory compliance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => rotateKeyMutation.mutate()}
              disabled={rotateKeyMutation.isPending}
              variant="success"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${rotateKeyMutation.isPending ? "animate-spin" : ""}`} />
              <span>Rotate KMS Master Key</span>
            </Button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Zero Trust Gateway PEP/PDP</span>
            <div className="text-2xl font-bold text-emerald-500">{health?.zeroTrustStatus || "ENFORCED"}</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">KMS Encryption Key Version</span>
            <div className="text-2xl font-bold text-primary">{health?.kmsKeyVersion || "v1.0.0"}</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">Active Authenticated Sessions</span>
            <div className="text-2xl font-bold text-indigo-500">{sessionList.length} sessions</div>
          </div>

          <div className="p-5 glass-card-static rounded-2xl space-y-1">
            <span className="text-muted-foreground text-[11px]">SIEM Active Threats</span>
            <div className="text-2xl font-bold text-amber-500">{threatList.length} threats</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/security/sessions" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-emerald-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Active Sessions & Revocation Console</h3>
            <p className="text-muted-foreground text-xs">Monitor user sessions, IP addresses, and enforce zero-trust session revocation.</p>
          </Link>

          <Link href="/security/mfa" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Smartphone className="w-6 h-6 text-primary" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Multi-Factor Authentication (MFA/TOTP)</h3>
            <p className="text-muted-foreground text-xs">Configure hardware and software authenticator applications for administrative access.</p>
          </Link>

          <Link href="/security/policies" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Shield className="w-6 h-6 text-purple-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">PEP/PDP Policy Engine Rules</h3>
            <p className="text-muted-foreground text-xs">Review active Policy Decision Point rules and enforcement modes.</p>
          </Link>

          <Link href="/security/compliance" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <FileCheck className="w-6 h-6 text-indigo-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">SOC 2 / ISO 27001 Regulatory Compliance</h3>
            <p className="text-muted-foreground text-xs">Inspect regulatory compliance telemetry, controls, and audit readiness reports.</p>
          </Link>

          <Link href="/security/threats" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">SIEM Security Threat Detection</h3>
            <p className="text-muted-foreground text-xs">Analyze real-time security alerts, intrusion attempts, and anomaly triggers.</p>
          </Link>

          <Link href="/security/incidents" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Flame className="w-6 h-6 text-red-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">Security Incident Response Console</h3>
            <p className="text-muted-foreground text-xs">Manage active security incidents, severity levels, and automated containment.</p>
          </Link>

          <Link href="/security/keys" className="p-6 glass-card rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Key className="w-6 h-6 text-pink-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-foreground text-sm font-sans">KMS Key Management & Rotation</h3>
            <p className="text-muted-foreground text-xs">Manage cryptographic master keys, rotation history, and envelope encryption status.</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
