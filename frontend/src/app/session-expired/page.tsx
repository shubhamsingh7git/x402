"use client";

import React from "react";
import Link from "next/link";
import { Clock, LogIn } from "lucide-react";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 glass-card-static rounded-3xl text-center shadow-2xl">
        <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Session Expired</h1>
        <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
          Your authentication token has expired for security reasons. Please log in again to continue accessing the platform.
        </p>
        <Button asChild variant="default" size="lg" className="w-full font-mono gap-2">
          <Link href={ROUTES.AUTH.LOGIN}>
            <LogIn className="w-4 h-4" />
            <span>Return to Login</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
