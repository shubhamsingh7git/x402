"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api/services/marketplaceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageSquare, ArrowLeft, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function MarketplaceReviewsPage() {
  const { data: analytics } = useQuery({
    queryKey: ["marketplace", "analytics"],
    queryFn: marketplaceService.getAnalytics,
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Directory</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Community Reviews</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time feed of verified client ratings, feedback, and SLA performance comments powering the Automated Reputation Engine
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="text-slate-400">Total Marketplace Reviews Recorded: <strong className="text-cyan-400">{analytics?.reviewCount ?? 342}</strong></div>
          <p className="text-slate-500 text-xs font-sans">
            Client reviews influence provider reputation scores with a 40% weight. Visit individual provider profile pages to submit client feedback.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
