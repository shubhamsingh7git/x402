"use client"

import { motion } from "framer-motion"

export function BudgetRunway() {
  const budgets = [
    { label: "Global Daily", current: 42.50, max: 50.00, color: "bg-amber-500" },
    { label: "Research-Alpha", current: 21.10, max: 25.00, color: "bg-blue-500" },
    { label: "Data-Scraper-V2", current: 18.40, max: 20.00, color: "bg-red-500" },
    { label: "Crypto-Analyst", current: 2.40, max: 15.00, color: "bg-emerald-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl"
    >
      <div className="px-6 py-5 border-b border-border/30">
        <h3 className="text-base font-semibold">Budget Runway</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Agent spending against allocated limits</p>
      </div>
      <div className="p-6 space-y-6">
        {budgets.map((budget, i) => {
          const pct = (budget.current / budget.max) * 100
          const isWarning = pct >= 80
          const isDanger = pct >= 90

          return (
            <motion.div
              key={budget.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{budget.label}</span>
                <span className="text-sm font-semibold tabular-nums">
                  ${budget.current.toFixed(2)}
                  <span className="text-muted-foreground font-normal"> / ${budget.max.toFixed(2)}</span>
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    isDanger ? "bg-red-500" : isWarning ? "bg-amber-500" : budget.color
                  }`}
                />
                {/* Glow at the edge */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`absolute inset-y-0 left-0 rounded-full blur-sm opacity-50 ${
                    isDanger ? "bg-red-500" : isWarning ? "bg-amber-500" : budget.color
                  }`}
                />
              </div>
              <div className="flex justify-end">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  isDanger
                    ? "bg-red-500/10 text-red-500"
                    : isWarning
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  {pct.toFixed(0)}% used
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
