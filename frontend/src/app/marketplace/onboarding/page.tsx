"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api/services/marketplaceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    merchantAlias: "Alpha Compute Merchant",
    displayName: "",
    description: "",
    category: "Analytics & Finance",
    capabilities: "financial-analysis, market-data",
    contactEmail: "onboarding@provider.com",
    tierName: "PAY_PER_CALL",
    pricePerCall: 0.02,
    uptimePercentage: 99.9,
    maxLatencyMs: 120,
  });

  const createMutation = useMutation({
    mutationFn: marketplaceService.createProvider,
    onSuccess: (data) => {
      router.push(`/marketplace/providers/${data.providerId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caps = formData.capabilities.split(",").map((c) => c.trim()).filter(Boolean);
    createMutation.mutate({
      merchantAlias: formData.merchantAlias,
      displayName: formData.displayName,
      description: formData.description,
      category: formData.category,
      capabilities: caps,
      contactEmail: formData.contactEmail,
      pricingModel: {
        providerId: "",
        tierName: formData.tierName,
        pricePerCall: Number(formData.pricePerCall),
        monthlyQuota: 100000,
        currency: "USD",
      },
      slaProfile: {
        providerId: "",
        uptimePercentage: Number(formData.uptimePercentage),
        maxLatencyMs: Number(formData.maxLatencyMs),
        guaranteedAvailability: `${formData.uptimePercentage}% Uptime`,
      },
    });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 font-mono text-xs">
        {/* Navigation */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Directory</span>
        </Link>

        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Self-Service Provider Onboarding</h1>
          </div>
          <p className="text-xs text-slate-400">
            Publish your AI capability provider profile, define SLA guarantees, set micro-payment pricing tiers, and sync automatically into the Bazaar discovery engine
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm font-sans border-b border-slate-800 pb-2">1. Provider Profile Details</h3>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Display Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Quantum Sentiment Inference Engine"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Merchant Alias</label>
              <input
                type="text"
                required
                value={formData.merchantAlias}
                onChange={(e) => setFormData({ ...formData, merchantAlias: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Detailed explanation of AI model capabilities, SLAs, and performance SLA..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
                >
                  <option value="Analytics & Finance">Analytics & Finance</option>
                  <option value="Web & Search">Web & Search</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Capabilities (comma separated)</label>
              <input
                type="text"
                required
                value={formData.capabilities}
                onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm font-sans border-b border-slate-800 pb-2">2. Pricing & SLA Guarantees</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Price Per Call ($ USD)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={formData.pricePerCall}
                  onChange={(e) => setFormData({ ...formData, pricePerCall: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Uptime Target (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.uptimePercentage}
                  onChange={(e) => setFormData({ ...formData, uptimePercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              variant="default"
              size="lg"
              className="w-full gap-2 font-mono"
            >
              {createMutation.isPending ? (
                <span>Submitting Provider Profile...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Provider Profile for Governance Review</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
