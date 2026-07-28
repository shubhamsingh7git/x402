"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const merchantData = [
  { name: "Legal Sandbox API", value: 6.68, percent: 45, color: "#3B82F6" },
  { name: "Deceptive Pattern DB", value: 4.45, percent: 30, color: "#10B981" },
  { name: "CoinGecko Pro API", value: 2.23, percent: 15, color: "#F59E0B" },
  { name: "LLM Synthesizer", value: 1.49, percent: 10, color: "#8B5CF6" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="glass-card rounded-xl px-3.5 py-2.5 border border-border/50 shadow-xl text-xs font-mono">
      <p className="font-semibold text-foreground">{data.name}</p>
      <p className="text-muted-foreground mt-0.5">${data.value.toFixed(2)} USDC ({data.percent}%)</p>
    </div>
  )
}

export function MerchantDonutChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="px-6 py-5 border-b border-border/30">
        <h3 className="text-base font-semibold">Merchant Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Top API & service fund recipients</p>
      </div>

      <div className="px-6 py-4 flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut Chart */}
        <div className="w-[180px] h-[180px] shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={merchantData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {merchantData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs text-muted-foreground font-mono">Total</span>
            <span className="text-sm font-bold">$14.85</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 w-full">
          {merchantData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-foreground truncate max-w-[140px]">{item.name}</span>
              </div>
              <span className="font-mono text-muted-foreground">${item.value.toFixed(2)} ({item.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
