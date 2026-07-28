"use client"

import React from "react"
import { motion } from "framer-motion"
import { Cpu, Bot, Zap, Shield, Sparkles, Terminal, Activity, Eye } from "lucide-react"

interface AgentAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  status?: "active" | "negotiating" | "blocked" | "idle"
  showBadge?: boolean
}

const AGENT_CONFIGS: Record<string, { icon: any; gradient: string; border: string; glow: string; rank: string; color: string }> = {
  "Research-Alpha": {
    icon: Bot,
    gradient: "from-blue-500/30 via-cyan-500/20 to-indigo-500/30",
    border: "border-blue-500/40",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    rank: "L3 Intelligence",
    color: "text-blue-400",
  },
  "Data-Scraper-V2": {
    icon: Terminal,
    gradient: "from-purple-500/30 via-pink-500/20 to-indigo-500/30",
    border: "border-purple-500/40",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    rank: "High-Speed Ingestion",
    color: "text-purple-400",
  },
  "Crypto-Analyst": {
    icon: Zap,
    gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    rank: "Quantitative Engine",
    color: "text-emerald-400",
  },
  "Policy-Engine": {
    icon: Shield,
    gradient: "from-amber-500/30 via-orange-500/20 to-red-500/30",
    border: "border-amber-500/40",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    rank: "x402 Guard",
    color: "text-amber-400",
  },
  "Default": {
    icon: Cpu,
    gradient: "from-primary/30 via-accent/20 to-primary/20",
    border: "border-primary/40",
    glow: "shadow-[0_0_15px_rgba(var(--primary),0.3)]",
    rank: "Autonomous Node",
    color: "text-primary",
  },
}

export function AgentAvatar({ name, size = "md", status = "active", showBadge = true }: AgentAvatarProps) {
  const config = AGENT_CONFIGS[name] || AGENT_CONFIGS["Default"]
  const Icon = config.icon

  const dimensions = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }[size]

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }[size]

  return (
    <div className="relative flex items-center gap-2.5 inline-flex">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 3 }}
        className={`relative rounded-xl bg-gradient-to-br ${config.gradient} border ${config.border} ${config.glow} flex items-center justify-center shrink-0 ${dimensions} transition-all duration-300`}
      >
        {/* Orbital Pulse Ring */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-40 animate-pulse pointer-events-none" />

        <Icon className={`${iconSizes} ${config.color} relative z-10`} />

        {/* Status Dot */}
        {showBadge && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
              status === "active"
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                : status === "negotiating"
                ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-ping"
                : status === "blocked"
                ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                : "bg-zinc-500"
            }`}
          />
        )}
      </motion.div>
    </div>
  )
}
