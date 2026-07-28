"use client"

import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { time: "00:00", spend: 2.4, blocked: 0.1 },
  { time: "02:00", spend: 3.1, blocked: 0.2 },
  { time: "04:00", spend: 4.8, blocked: 0.5 },
  { time: "06:00", spend: 7.2, blocked: 0.7 },
  { time: "08:00", spend: 12.1, blocked: 1.2 },
  { time: "10:00", spend: 18.6, blocked: 2.1 },
  { time: "12:00", spend: 25.4, blocked: 3.4 },
  { time: "14:00", spend: 28.9, blocked: 3.8 },
  { time: "16:00", spend: 31.8, blocked: 4.1 },
  { time: "18:00", spend: 35.5, blocked: 4.5 },
  { time: "20:00", spend: 38.2, blocked: 4.8 },
  { time: "22:00", spend: 40.8, blocked: 5.0 },
  { time: "24:00", spend: 42.5, blocked: 5.2 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-border/50 shadow-xl">
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
          <span className="font-semibold">${entry.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export function SpendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Spend Velocity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 24 hours — USDC on Base L2</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6b8cba]" />
              Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              Blocked
            </span>
          </div>
        </div>
      </div>
      <div className="px-2 py-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b8cba" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6b8cba" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,130,180,0.08)" />
              <XAxis
                dataKey="time"
                stroke="rgba(100,130,180,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'rgba(150,170,200,0.6)' }}
              />
              <YAxis
                stroke="rgba(100,130,180,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: 'rgba(150,170,200,0.6)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#6b8cba"
                fill="url(#spendGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#6b8cba', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="#ef4444"
                fill="url(#blockedGradient)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
