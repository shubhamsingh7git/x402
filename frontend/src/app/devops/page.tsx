"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { devopsService } from "@/lib/api/services/devopsService";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Box,
  Layers,
  GitBranch,
  Package,
  RefreshCw,
  Cpu,
  Save,
  LifeBuoy,
  ShieldCheck,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DevOpsOverviewPage() {
  const { data: clusters } = useQuery({
    queryKey: ["devops", "clusters"],
    queryFn: devopsService.getClusters,
  });

  const { data: deployments } = useQuery({
    queryKey: ["devops", "deployments"],
    queryFn: devopsService.getDeployments,
  });

  const { data: pipelines } = useQuery({
    queryKey: ["devops", "pipelines"],
    queryFn: devopsService.getPipelines,
  });

  const { data: gitOps } = useQuery({
    queryKey: ["devops", "gitops"],
    queryFn: devopsService.getGitOps,
  });

  const clusterList = clusters || [];
  const deploymentList = deployments || [];
  const pipelineList = pipelines || [];
  const gitOpsList = gitOps || [];

  return (
    <AppLayout>
      <div className="space-y-8 font-mono text-xs">
        {/* Header */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Box className="w-6 h-6 text-cyan-400" />
              <span>Enterprise Cloud DevOps & Infrastructure Automation</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Kubernetes cluster management, GitOps synchronization, CI/CD pipelines, DevSecOps supply chain security (Cosign/SBOM), HPA autoscaling & disaster recovery
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/devops/deployments"
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 font-sans text-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Deploy Progressive Canary</span>
            </Link>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Active Kubernetes Clusters</span>
            <div className="text-2xl font-bold text-emerald-400">{clusterList.length} clusters</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">Workload Deployments</span>
            <div className="text-2xl font-bold text-cyan-400">{deploymentList.length} deployments</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">CI/CD Pipelines</span>
            <div className="text-2xl font-bold text-indigo-400">{pipelineList.length} pipelines</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[11px]">GitOps Synchronized Apps</span>
            <div className="text-2xl font-bold text-purple-400">{gitOpsList.length} applications</div>
          </div>
        </div>

        {/* Administrative Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/devops/clusters" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Box className="w-6 h-6 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Kubernetes Clusters Console</h3>
            <p className="text-slate-400 text-xs">Manage Kubernetes cluster nodes, regions, versions, and CPU/Memory utilization.</p>
          </Link>

          <Link href="/devops/deployments" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Layers className="w-6 h-6 text-cyan-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Workload Deployments Roster</h3>
            <p className="text-slate-400 text-xs">Canary, Blue/Green progressive rollouts and instant zero-downtime rollbacks.</p>
          </Link>

          <Link href="/devops/pipelines" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <GitBranch className="w-6 h-6 text-indigo-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">CI/CD Pipelines & Runs</h3>
            <p className="text-slate-400 text-xs">Continuous Integration automated build triggers, testing, and release management.</p>
          </Link>

          <Link href="/devops/releases" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Package className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Helm Releases & Packages</h3>
            <p className="text-slate-400 text-xs">Helm chart releases, chart versions, and release deployment namespaces.</p>
          </Link>

          <Link href="/devops/gitops" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <RefreshCw className="w-6 h-6 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">GitOps Applications Stream</h3>
            <p className="text-slate-400 text-xs">ArgoCD/Flux style GitOps state synchronization and declarative manifest drift control.</p>
          </Link>

          <Link href="/devops/autoscaling" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Cpu className="w-6 h-6 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Horizontal Pod Autoscaler (HPA)</h3>
            <p className="text-slate-400 text-xs">Configure CPU/Memory threshold autoscaling policies and pod replica limits.</p>
          </Link>

          <Link href="/devops/backups" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-pink-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <Save className="w-6 h-6 text-pink-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Backups & Snapshots Console</h3>
            <p className="text-slate-400 text-xs">Cluster volume snapshots, automated backups, and point-in-time restores.</p>
          </Link>

          <Link href="/devops/disaster-recovery" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-red-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <LifeBuoy className="w-6 h-6 text-red-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">Disaster Recovery Plans</h3>
            <p className="text-slate-400 text-xs">Multi-region failover, RPO/RTO metrics, and automated disaster recovery testing.</p>
          </Link>

          <Link href="/devops/supply-chain" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition-all rounded-2xl space-y-3 group">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm font-sans">DevSecOps Supply Chain & Cosign</h3>
            <p className="text-slate-400 text-xs">Software Bill of Materials (SBOM) and Cosign cryptographic image signatures.</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
