"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { securityService } from "@/lib/api/services/securityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Key, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function KeysPage() {
  const { data: health, refetch } = useQuery({
    queryKey: ["security", "health"],
    queryFn: securityService.getHealth,
  });

  const rotateMutation = useMutation({
    mutationFn: securityService.rotateKeys,
    onSuccess: () => refetch(),
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
            <Key className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">AES-256-GCM KMS Keys Vault & Envelope Encryption</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Key Management Service (KMS) master keys, envelope encryption, and automated key rotation
          </p>
        </div>

        <div className="p-6 glass-card-static rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground text-sm font-sans">Active KMS Master Key</h3>
              <p className="text-muted-foreground text-xs mt-1">Current Active Version: <strong className="text-emerald-500 font-mono">{health?.kmsKeyVersion || "v1.0.0"}</strong></p>
            </div>

            <Button
              onClick={() => rotateMutation.mutate()}
              disabled={rotateMutation.isPending}
              variant="default"
              size="sm"
              className="gap-2 font-sans"
            >
              <RefreshCw className={`w-4 h-4 ${rotateMutation.isPending ? "animate-spin" : ""}`} />
              <span>Rotate Master Key</span>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
