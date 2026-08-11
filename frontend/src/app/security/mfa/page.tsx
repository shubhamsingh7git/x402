"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Smartphone, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MfaPage() {
  const mfaSetupMutation = useMutation({
    mutationFn: securityService.mfaSetup,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/security" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enterprise Security Administration</span>
        </Link>

        <div className="p-6 glass-card-static rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">MFA & Device Trust Enrollment</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-factor authentication (TOTP, WebAuthn) and trusted hardware device enrollment
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <h3 className="font-bold text-foreground text-sm font-sans flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>MFA Device Setup</span>
          </h3>

          <Button
            onClick={() => mfaSetupMutation.mutate()}
            disabled={mfaSetupMutation.isPending}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll TOTP Authenticator Device</span>
          </Button>

          {mfaSetupMutation.data && (
            <div className="p-4 inner-box space-y-2">
              <div className="font-bold text-emerald-400 font-sans">MFA Device Enrolled Successfully!</div>
              <div className="text-[10px] text-slate-400">Device ID: {mfaSetupMutation.data.deviceId}</div>
              <div className="text-[10px] text-slate-400 font-mono break-all">OTP Auth URI: {mfaSetupMutation.data.qrCodeUrl}</div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
