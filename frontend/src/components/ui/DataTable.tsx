"use client";

import React, { useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { Button } from "./button";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  onRefresh,
  searchable = true,
  searchPlaceholder = "Search records...",
  onSearchChange,
  pagination,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  // Array safety guard — DataTable must NEVER crash if passed undefined/null or object
  const rows = Array.isArray(data) ? data : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleExportCSV = () => {
    if (rows.length === 0) return;
    const keys = columns.map((c) => String(c.header));
    const csvRows = [keys.join(",")];
    rows.forEach((row: any) => {
      const values = columns.map((c) => {
        const val = c.accessorKey ? row[c.accessorKey] : "";
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 glass-card-static rounded-2xl">
        {searchable && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleExportCSV}
            title="Export CSV"
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              title="Refresh Data"
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card-static rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono">
                    {columns.map((col, idx) => (
                      <th key={idx} scope="col" className={`p-4 font-semibold uppercase tracking-wider ${col.className || ""}`}>
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  {rows.map((row, rIdx) => (
                    <tr key={row._id || row.id || rIdx} className="hover:bg-muted/40 transition-colors">
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className={`p-4 ${col.className || ""}`}>
                          {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey as keyof T] ?? "") : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout Fallback */}
            <div className="block md:hidden divide-y divide-border">
              {rows.map((row, rIdx) => (
                <div key={row._id || row.id || rIdx} className="p-4 space-y-2">
                  {columns.map((col, cIdx) => (
                    <div key={cIdx} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-mono">{col.header}:</span>
                      <div className="font-mono text-foreground">
                        {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey as keyof T] ?? "") : null}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 font-mono text-xs text-muted-foreground">
            <div>
              Showing page <span className="text-foreground font-bold">{pagination.page}</span> of{" "}
              <span className="text-foreground font-bold">{pagination.totalPages}</span> ({pagination.total} total items)
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                variant="outline"
                size="icon-sm"
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                variant="outline"
                size="icon-sm"
                className="cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
