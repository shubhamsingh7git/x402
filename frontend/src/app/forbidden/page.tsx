"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center shadow-2xl backdrop-blur-xl">
        <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">403 — Forbidden Permission</h1>
        <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
          Your current user role does not have sufficient permissions to access this feature.
        </p>
        <Link
          href={ROUTES.DASHBOARD}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 font-mono border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
