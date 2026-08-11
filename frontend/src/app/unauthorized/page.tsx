"use client";

import React from "react";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 glass-card-static rounded-3xl text-center shadow-2xl">
        <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">401 — Unauthorized Access</h1>
        <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
          You must be logged in to view this resource. Please sign in with valid credentials.
        </p>
        <Button asChild variant="default" size="lg" className="w-full font-mono gap-2">
          <Link href={ROUTES.AUTH.LOGIN}>
            <LogIn className="w-4 h-4" />
            <span>Sign In to Platform</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
