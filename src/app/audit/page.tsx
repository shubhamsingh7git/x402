"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, ExternalLink, ShieldAlert, CheckCircle2, FileText, Search, Filter } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function AuditLedgerPage() {
  const { auditLogs } = useAppStore()

  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Blocked" | "Failed">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("2026-07-20")
  const [dateTo, setDateTo] = useState("2026-07-27")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Approved"
        ? log.policyDecision === "Approved"
        : statusFilter === "Blocked"
        ? log.policyDecision === "Denied"
        : false

    const matchesSearch =
      log.targetService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.rejectionReason.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Target Service", "Network", "Scheme", "Amount Requested", "Decision", "Reason", "Tx Hash"]
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.targetService,
      l.network,
      l.scheme,
      `$${l.amountRequested.toFixed(2)} USDC`,
      l.policyDecision,
      l.rejectionReason,
      l.txHash,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `x402_fiduciary_audit_ledger_${dateTo}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 min-h-screen bg-[#F3F4F6] dark:bg-[#111827] transition-colors duration-300">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Fiduciary Audit & Compliance Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            SOX compliance & model risk management cryptographic audit trail linking AI reasoning to settled blockchain transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2 rounded-xl h-9 text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
          <Button onClick={handleExportPDF} size="sm" className="gap-2 rounded-xl h-9 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Top Controls Bar: Date Range Pickers, Status Filters, Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-2xl border border-border/40 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4"
      >
        {/* Date Pickers */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Range:</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-36 text-xs font-mono rounded-xl bg-transparent border-border/40"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-36 text-xs font-mono rounded-xl bg-transparent border-border/40"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/40 text-xs">
          {(["All", "Approved", "Blocked", "Failed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === st
                  ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search service, tx hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-transparent border-border/40"
          />
        </div>
      </motion.div>

      {/* Main Audit Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden border border-border/40 shadow-sm"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/20 dark:bg-[#16161E] bg-[#F9FAFB] hover:bg-transparent">
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Timestamp</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Target Service</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Network</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Scheme</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Amount Requested</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Policy Decision</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E]">Rejection Reason</TableHead>
                <TableHead className="text-xs font-bold text-[#FFFFFF] dark:text-[#FFFFFF] dark:bg-[#16161E] text-right">Tx Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const isApproved = log.policyDecision === "Approved"
                return (
                  <TableRow
                    key={log.id}
                    className="border-b border-gray-200 dark:border-border/20 dark:even:bg-[#1E1E28] dark:odd:bg-[#22222E] hover:bg-muted/20 transition-colors text-xs font-mono"
                  >
                    <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell className="font-sans font-medium text-foreground truncate max-w-[220px]">
                      {log.targetService}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.network}</TableCell>
                    <TableCell className="text-muted-foreground">{log.scheme}</TableCell>
                    <TableCell className="font-bold text-foreground">
                      ${log.amountRequested.toFixed(2)} USDC
                    </TableCell>
                    <TableCell>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800 bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold dark:bg-red-950 dark:text-red-300 dark:border dark:border-red-800 bg-pink-100 text-red-800">
                          <ShieldAlert className="w-3 h-3 text-red-500" /> Denied
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-sans truncate max-w-[240px]">
                      {log.rejectionReason}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.txHash !== "0x0000000000000000000000000000000000000000" ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${log.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-500 hover:underline font-mono text-[11px]"
                        >
                          {log.txHash.slice(0, 6)}...{log.txHash.slice(-4)}
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  )
}
