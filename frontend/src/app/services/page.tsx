"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { serviceService } from "@/lib/api/services/serviceService";
import { merchantService } from "@/lib/api/services/merchantService";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ApiService } from "@/types";
import { Server, Plus, ToggleLeft, ToggleRight, Trash2, Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiService | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [endpoint, setEndpoint] = useState("https://api.search.x402.io/v1/query");
  const [pricePerCall, setPricePerCall] = useState(0.01);
  const [capabilities, setCapabilities] = useState("search, financial_data");

  const { data: servicesData, isLoading, isError, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: () => serviceService.listServices(),
  });

  const { data: merchantsData } = useQuery({
    queryKey: ["merchants", "select"],
    queryFn: () => merchantService.listMerchants({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      setIsCreateOpen(false);
      setName("");
      setServiceId("");
      refetch();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      serviceService.toggleService(id, isEnabled),
    onSuccess: () => refetch(),
  });

  const deleteMutation = useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      setDeleteTarget(null);
      refetch();
    },
  });

  const columns: Column<ApiService>[] = [
    {
      header: "Service Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-bold text-white">{row.name}</div>
          <div className="text-[10px] text-slate-500 font-mono">ID: {row.serviceId}</div>
        </div>
      ),
    },
    {
      header: "Merchant Alias",
      accessorKey: "merchantAlias",
    },
    {
      header: "Endpoint URL",
      accessorKey: "endpoint",
      cell: (row) => (
        <span className="font-mono text-cyan-400 text-xs truncate max-w-[200px] inline-block">{row.endpoint}</span>
      ),
    },
    {
      header: "Price per Call",
      accessorKey: "pricePerCall",
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">${Number(row.pricePerCall ?? 0).toFixed(4)} USD</span>,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.isEnabled ? "VERIFIED" : "SUSPENDED"} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleMutation.mutate({ id: row._id, isEnabled: !row.isEnabled })}
            className="p-1.5 hover:bg-slate-800 text-slate-400 rounded"
          >
            {row.isEnabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 glass-card-static rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-500" />
              <span>x402 API Service Catalog</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Registered API services, price per call rates, endpoint capabilities, and provider resolution
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="default"
            className="gap-2 font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Create API Service</span>
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={servicesData?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
          searchPlaceholder="Search services by name, endpoint..."
          emptyTitle="No API Services Cataloged"
          emptyDescription="Click 'Create API Service' to register new endpoints."
        />

        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md glass-card-static rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                <span>Catalog New API Service</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-foreground font-semibold mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Real-Time Financial Intelligence"
                    className="w-full px-3 py-2 inner-box text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Service ID *</label>
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="e.g. svc_financial"
                    className="w-full px-3 py-2 inner-box text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Merchant Provider *</label>
                  <select
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="w-full px-3 py-2 inner-box text-foreground"
                  >
                    <option value="">-- Select Merchant --</option>
                    {(Array.isArray(merchantsData?.data) ? merchantsData.data : []).map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.alias}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Endpoint URL</label>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full px-3 py-2 inner-box text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-1">Price per Call ($ USD)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={pricePerCall}
                    onChange={(e) => setPricePerCall(Number(e.target.value))}
                    className="w-full px-3 py-2 inner-box text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    createMutation.mutate({
                      name,
                      serviceId,
                      merchantId,
                      endpoint,
                      pricePerCall,
                      capabilities: capabilities.split(",").map((s) => s.trim()),
                    })
                  }
                  disabled={!name || !serviceId || !merchantId || createMutation.isPending}
                  variant="default"
                >
                  {createMutation.isPending ? "Cataloging..." : "Catalog Service"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Delete API Service?"
          description={`Remove service [${deleteTarget?.name}] from the catalog?`}
          confirmText="Yes, Delete Service"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}
