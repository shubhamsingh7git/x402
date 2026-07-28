"use client"

import { motion } from "framer-motion"
import { Wallet, ShieldAlert, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)

      if (step >= steps) {
        setDisplay(value)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatted = Number.isInteger(value) ? Math.round(display).toString() : display.toFixed(2)

  return (
    <span className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  )
}

export function MetricCards() {
  const { usdcBalance, dailyBudgetLimit } = useAppStore()

  const metrics = [
    {
      title: "Total Daily Spend",
      value: 14.85,
      prefix: "$",
      suffix: " USDC",
      subtext: `Cap: $${dailyBudgetLimit.toFixed(2)} USDC`,
      icon: DollarSign,
      trend: "+8.4%",
      trendUp: true,
      cardBg: "dark:bg-[#1F2937] bg-white",
      positive: false,
      critical: false,
    },
    {
      title: "Active Agent Loops",
      value: 12,
      suffix: " Loops",
      subtext: "Across 3 research pipelines",
      icon: Activity,
      trend: "+2 active",
      trendUp: true,
      cardBg: "dark:bg-[#1F2937] bg-white",
      positive: false,
      critical: false,
    },
    {
      title: "Blocked Transactions (Count)",
      value: 3,
      suffix: " Blocked",
      subtext: "Policy Guard interceptions",
      icon: ShieldAlert,
      trend: "+1 rule trigger",
      trendUp: false,
      cardBg: "dark:bg-[#1F2937] bg-white",
      positive: false,
      critical: true, // Bright Coral #EF4444 in dark, muted crimson in light
    },
    {
      title: "Available Treasury Balance",
      value: usdcBalance,
      prefix: "$",
      suffix: " USDC",
      subtext: "CDP Session Wallet",
      icon: Wallet,
      trend: "Nominal",
      trendUp: true,
      cardBg: "dark:bg-[#1F2937] bg-white",
      positive: true, // Neon Green #10B981 in dark, forest green in light
      critical: false,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div
              className={`rounded-2xl p-5 border border-border/40 shadow-sm transition-all duration-300 ${metric.cardBg}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {metric.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    metric.critical
                      ? "bg-red-500/10 text-red-500"
                      : metric.positive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`text-2xl lg:text-3xl font-bold tracking-tight mb-1 ${
                  metric.critical
                    ? "text-[#EF4444] dark:text-[#EF4444]"
                    : metric.positive
                    ? "text-emerald-700 dark:text-[#10B981]"
                    : "text-foreground"
                }`}
              >
                <AnimatedNumber value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>{metric.subtext}</span>
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                    metric.critical
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {metric.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {metric.trend}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
