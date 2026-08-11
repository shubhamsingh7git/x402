"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { controlPlaneService } from "@/lib/api/services/controlPlaneService";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Building2,
  FolderKanban,
  Users,
  ShieldCheck,
  Key,
  Lock,
  Flag,
  SlidersHorizontal,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ControlPlaneOverviewPage() {
  const { data: orgs, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["control-plane", "organizations"],
    queryFn: controlPlaneService.getOrganizations,
  });

  const { data: workspaces } = useQuery({
    queryKey: ["control-plane", "workspaces"],
    queryFn: () => controlPlaneService.getWorkspaces(),
  });

  const { data: projects } = useQuery({
    queryKey: ["control-plane", "projects"],
    queryFn: () => controlPlaneService.getProjects(),
  });

  const { data: flags } = useQuery({
    queryKey: ["control-plane", "flags"],
    queryFn: controlPlaneService.getFeatureFlags,
  });

  const orgList = orgs || [];
  const wsList = workspaces || [];
  const projList = projects || [];
  const flagList = flags || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <span>Enterprise Control Plane Administration</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tenant organizational hierarchy, RBAC v2 permissions, API credentials, secret rotation, feature targeting, and tenant quotas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/control-plane/organizations"
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Building2 className="w-4 h-4" />
              <span>Manage Organizations</span>
            </Link>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Organizations Roster</span>
            <div className="text-2xl font-bold text-cyan-400">{orgList.length} orgs</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Active Workspaces</span>
            <div className="text-2xl font-bold text-purple-400">{wsList.length} workspaces</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Projects Directory</span>
            <div className="text-2xl font-bold text-indigo-400">{projList.length} projects</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Feature Flags Active</span>
            <div className="text-2xl font-bold text-emerald-400">{flagList.filter((f) => f.enabled).length} / {flagList.length}</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/control-plane/organizations" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Multi-Tenant Organizations</h3>
            <p className="text-slate-400 text-xs">Manage enterprise organization boundaries, member invitations, and tenant quotas.</p>
          </Link>

          <Link href="/control-plane/rbac" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">RBAC v2 Roles & Matrix</h3>
            <p className="text-slate-400 text-xs">Granular organization, workspace, project, and custom permission role assignments.</p>
          </Link>

          <Link href="/control-plane/api-keys" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Key className="w-6 h-6 text-indigo-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Scoped API Credentials</h3>
            <p className="text-slate-400 text-xs">Generate scoped API keys with expiration and granular access permissions.</p>
          </Link>

          <Link href="/control-plane/secrets" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Lock className="w-6 h-6 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Encrypted Secrets Vault</h3>
            <p className="text-slate-400 text-xs">Store and rotate AES-256 encrypted secrets with version history.</p>
          </Link>

          <Link href="/control-plane/feature-flags" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Flag className="w-6 h-6 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Targeted Feature Flags</h3>
            <p className="text-slate-400 text-xs">Toggle features per global, organization, workspace, or project scope.</p>
          </Link>

          <Link href="/control-plane/quotas" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-pink-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <SlidersHorizontal className="w-6 h-6 text-pink-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Tenant Quotas & Policy</h3>
            <p className="text-slate-400 text-xs">Daily spend limits, request rate limits, and tenant isolation policies.</p>
          </Link>
        </div>

        {/* Organizations Roster Table */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Multi-Tenant Organizations Roster</span>
            </h3>
            <Link href="/control-plane/organizations" className="text-xs text-cyan-400 hover:underline">
              View All Organizations →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingOrgs ? (
              <LoadingSkeleton rows={2} />
            ) : (
              orgList.map((o) => (
                <div key={o.organizationId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-sans text-sm">{o.name}</div>
                      <div className="text-[10px] text-slate-500">ID: {o.organizationId} • Slug: {o.slug}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-slate-400 text-xs font-mono pt-1">
                    Max Workspaces: <strong className="text-purple-400">{o.maxWorkspaces}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
