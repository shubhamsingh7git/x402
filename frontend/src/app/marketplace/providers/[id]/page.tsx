"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api/services/marketplaceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ShoppingBag,
  ArrowLeft,
  Star,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Award,
  MessageSquare,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function MarketplaceProviderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const { data: details, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace", "provider", id],
    queryFn: () => marketplaceService.getProviderById(id),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => marketplaceService.updateStatus(id, status),
    onSuccess: () => refetch(),
  });

  const addReviewMutation = useMutation({
    mutationFn: marketplaceService.addReview,
    onSuccess: () => {
      setReviewTitle("");
      setReviewComment("");
      refetch();
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewMutation.mutate({ providerId: id, rating: reviewRating, title: reviewTitle, comment: reviewComment });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton rows={6} />
      </AppLayout>
    );
  }

  if (isError || !details) {
    return (
      <AppLayout>
        <ErrorState title="Provider Not Found" message="Could not load provider profile details" onRetry={refetch} />
      </AppLayout>
    );
  }

  const { profile, pricingModel, slaProfile, reputation, reviews } = details;

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Directory</span>
        </Link>

        {/* Hero Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">{profile.displayName}</h1>
              <StatusBadge status={profile.status} />
              {profile.businessVerified && (
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Merchant
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Provider ID: <strong className="text-white">{profile.providerId}</strong> • Category: <strong className="text-slate-200">{profile.category}</strong>
            </p>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center gap-2">
            {profile.status === "DRAFT" || profile.status === "SUBMITTED" ? (
              <button
                onClick={() => updateStatusMutation.mutate("APPROVED")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Provider</span>
              </button>
            ) : profile.status === "APPROVED" ? (
              <button
                onClick={() => updateStatusMutation.mutate("ACTIVE")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Activate in Bazaar</span>
              </button>
            ) : profile.status === "ACTIVE" ? (
              <button
                onClick={() => updateStatusMutation.mutate("SUSPENDED")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Suspend Provider</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Telemetry & Reputation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Automated Reputation Score</span>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>{profile.reputationScore} / 100</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Pricing Rate</span>
            <div className="text-2xl font-bold text-emerald-400">${pricingModel?.pricePerCall || 0.02} USD / call</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">SLA Guaranteed Uptime</span>
            <div className="text-2xl font-bold text-purple-400">{slaProfile?.uptimePercentage || 99.9}%</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">SLA Maximum Latency</span>
            <div className="text-2xl font-bold text-cyan-400">{slaProfile?.maxLatencyMs || 120} ms</div>
          </div>
        </div>

        {/* Capabilities & Profile Description */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Capabilities & Profile Description</span>
          </h3>

          <p className="text-slate-300 text-xs font-sans leading-relaxed">{profile.description}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {(profile.capabilities || []).map((cap: string) => (
              <span key={cap} className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-lg text-xs font-mono border border-slate-700/60">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Community Reviews & Review Form */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Client Reviews & Ratings</span>
          </h3>

          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-slate-400 font-semibold">Rating:</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="px-2 py-1 bg-slate-900 border border-slate-800 text-amber-400 font-bold rounded"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
                <option value={2}>2 Stars ★★☆☆☆</option>
                <option value={1}>1 Star ★☆☆☆☆</option>
              </select>
            </div>

            <input
              type="text"
              required
              placeholder="Review title..."
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />

            <textarea
              required
              rows={2}
              placeholder="Write client feedback..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />

            <button
              type="submit"
              disabled={addReviewMutation.isPending}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
            >
              Post Review & Recalculate Reputation
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {(reviews || []).map((rev: any) => (
              <div key={rev.reviewId} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{rev.title}</span>
                    <span className="text-amber-400 font-bold text-xs">{rev.rating} ★</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{rev.authorAlias}</span>
                </div>
                <p className="text-slate-400 text-xs font-sans">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
