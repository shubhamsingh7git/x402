"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrganizationRecord } from "@/types";
import { Building2, ArrowLeft, Plus, Mail } from "lucide-react";
import Link from "next/link";

export default function OrganizationsPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const { data: orgs, isLoading, refetch } = useQuery({
    queryKey: ["control-plane", "organizations", "all"],
    queryFn: controlPlaneService.getOrganizations,
  });

  const createOrgMutation = useMutation({
    mutationFn: controlPlaneService.createOrganization,
    onSuccess: () => {
      setName("");
      setSlug("");
      refetch();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createOrgMutation.mutate({ name, slug });
  };

  const orgList = orgs || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/control-plane" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Plane Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Tenant Organizations Manager</h1>
          </div>
          <p className="text-xs text-slate-400">
            Tenant isolation boundary, organization lifecycle, workspace allocations, and member onboarding
          </p>
        </div>

        {/* Create Organization Form */}
        <form onSubmit={handleCreate} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Create New Organization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Organization Name (e.g. Acme Corp)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
              }}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <input
              type="text"
              required
              placeholder="Organization Slug (e.g. acme-corp)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={createOrgMutation.isPending}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20"
          >
            Create Organization
          </button>
        </form>

        {/* Roster Grid */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Active Organizations ({orgList.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orgList.map((o) => (
              <div key={o.organizationId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-sans text-sm">{o.name}</div>
                    <div className="text-[10px] text-slate-500">ID: {o.organizationId} • Slug: {o.slug}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs font-mono pt-2 border-t border-slate-900">
                  <span>Max Workspaces: <strong className="text-purple-400">{o.maxWorkspaces}</strong></span>
                  <span>Owner: <strong className="text-cyan-400">{o.ownerId}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
