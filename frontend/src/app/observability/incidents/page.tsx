"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { observabilityService } from "@/lib/api/services/observabilityService";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Flame, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function IncidentsPage() {
  const [title, setTitle] = useState("");

  const { data: incidents, isLoading, refetch } = useQuery({
    queryKey: ["observability", "incidents", "all"],
    queryFn: observabilityService.getIncidents,
  });

  const createIncidentMutation = useMutation({
    mutationFn: observabilityService.openIncident,
    onSuccess: () => {
      setTitle("");
      refetch();
    },
  });

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    createIncidentMutation.mutate({
      title,
      affectedServices: ["agents-service", "intelligence-service"],
      severity: "HIGH",
    });
  };

  const incidentList = incidents || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/observability" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observability Administration</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Incident Lifecycle & Operational Response</h1>
          </div>
          <p className="text-xs text-slate-400">
            Operational incident lifecycle management (OPEN → ACKNOWLEDGED → RESOLVED) with root cause links
          </p>
        </div>

        {/* Open Incident Form */}
        <form onSubmit={handleOpen} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-400" />
            <span>Declare Operational Incident</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="Incident Title (e.g. Agent Memory Store Latency Spike)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs w-80"
            />
            <Button
              type="submit"
              disabled={createIncidentMutation.isPending}
              variant="destructive"
              size="sm"
            >
              Open Incident
            </Button>
          </div>
        </form>

        {/* Incidents Roster */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span>Operational Incidents ({incidentList.length})</span>
          </h3>

          <div className="space-y-3">
            {incidentList.map((inc) => (
              <div key={inc.incidentId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{inc.title}</div>
                  <StatusBadge status={inc.status} />
                </div>
                <div className="text-[10px] text-slate-500">ID: {inc.incidentId} • Affected Services: {(inc.affectedServices || []).join(", ")}</div>
                {inc.rootCause && (
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300 text-[10px] font-sans">
                    Root Cause: {inc.rootCause}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
