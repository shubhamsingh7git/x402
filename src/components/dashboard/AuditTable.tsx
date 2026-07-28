"use client"

import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function AuditTable() {
  const { auditLogs } = useAppStore()
  const recentLogs = auditLogs.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Recent Agent Telemetry</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 5 high-level tasks completed or intercepted by Policy Guard</p>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono rounded-md border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
          Live Stream Active
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 dark:bg-[#16161E] bg-[#F9FAFB] hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Timestamp</TableHead>
              <TableHead className="text-xs font-semibold">Target Service</TableHead>
              <TableHead className="text-xs font-semibold">Network</TableHead>
              <TableHead className="text-xs font-semibold">Amount</TableHead>
              <TableHead className="text-xs font-semibold">Decision</TableHead>
              <TableHead className="text-xs font-semibold">Reason / Telemetry</TableHead>
              <TableHead className="text-xs font-semibold text-right">Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentLogs.map((log) => {
              const isApproved = log.policyDecision === "Approved"
              return (
                <TableRow
                  key={log.id}
                  className="border-border/10 dark:even:bg-[#1E1E28] dark:odd:bg-[#22222E] hover:bg-muted/30 transition-colors text-xs font-mono"
                >
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="font-sans font-medium text-foreground truncate max-w-[200px]">
                    {log.targetService}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.network}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    ${log.amountRequested.toFixed(2)} USDC
                  </TableCell>
                  <TableCell>
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800 bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold dark:bg-red-950 dark:text-red-300 dark:border dark:border-red-800 bg-pink-100 text-red-800">
                        <ShieldAlert className="w-3 h-3 text-red-500" /> Denied
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-sans truncate max-w-[220px]">
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
  )
}
