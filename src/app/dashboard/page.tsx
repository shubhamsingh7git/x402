"use client"

import { motion } from "framer-motion"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { SpendChart } from "@/components/dashboard/SpendChart"
import { MerchantDonutChart } from "@/components/dashboard/MerchantDonutChart"
import { AuditTable } from "@/components/dashboard/AuditTable"
import { Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-screen bg-[#F3F4F6] dark:bg-[#111827] transition-colors duration-300">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Macroeconomic command center & fiduciary overview for corporate treasury burn
          </p>
        </div>

        <Link href="/policy">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-3 flex items-center gap-3 bg-white dark:bg-[#1F2937] border border-border/40 shadow-sm cursor-pointer group hover:border-primary/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Policy Guard Active</div>
              <div className="text-[10px] text-muted-foreground">Hard middleware enforcing limits</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Top Row: KPI Cards */}
      <MetricCards />

      {/* Middle Row: Charts (Spend Velocity Line Chart & Merchant Distribution Donut Chart) */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SpendChart />
        </div>
        <div className="lg:col-span-2">
          <MerchantDonutChart />
        </div>
      </div>

      {/* Bottom Row: Recent Agent Telemetry Ledger */}
      <AuditTable />
    </div>
  )
}
