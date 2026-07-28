"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, BrainCircuit, ArrowRight, Activity, Flame, Layers, Terminal, Play, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Carousel3D, CarouselItem } from "@/components/ui/3d-carousel"
import { AgentAvatar } from "@/components/ui/agent-avatar"
import { ThreeCoinBackground } from "@/components/landing/ThreeCoinBackground"

const telemetrySlides: CarouselItem[] = [
  {
    id: 1,
    title: "Live Agent Telemetry Stream",
    description: "Real-time SSE event pipeline tracking every micro-transaction, query, and cryptographic signature executed by AI agents.",
    icon: <Terminal className="w-6 h-6 text-blue-400" />,
    badge: "SSE Stream • Live",
    customContent: (
      <div className="font-mono text-[11px] p-2.5 rounded-xl bg-black/70 border border-blue-500/20 text-blue-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">[11:47:10]</span>
          <span className="text-emerald-400 font-bold">✓ Settled</span>
        </div>
        <div className="truncate text-zinc-300">Agent #Research-Alpha → SerpAPI</div>
        <div className="text-[10px] text-zinc-500">0.01 USDC | Latency: 180ms | Base L2</div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Cryptographic Settlement",
    description: "Verifiable payment receipts signed instantly via x402 Facilitator contracts across Base, Optimism, and Arbitrum.",
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    badge: "EIP-155:8453 Verified",
    customContent: (
      <div className="font-mono text-[11px] p-2.5 rounded-xl bg-black/70 border border-emerald-500/20 text-emerald-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Hash:</span>
          <span className="text-emerald-400 font-bold">0x8F9...2A1B</span>
        </div>
        <div className="text-[10px] text-zinc-400">Merchant: 0x1A2B3C4D (OpenAI)</div>
        <div className="text-[10px] text-emerald-500 font-semibold">Proof: Merkle Tree Verified</div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Smart Policy Guardrails",
    description: "Real-time enforcement of velocity limits, merchant allowlists, and spending caps before transactions hit the wire.",
    icon: <Shield className="w-6 h-6 text-amber-400" />,
    badge: "POL-001 Active",
    customContent: (
      <div className="font-mono text-[11px] p-2.5 rounded-xl bg-black/70 border border-amber-500/20 text-amber-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Daily Cap:</span>
          <span className="text-amber-400 font-bold">$42.50 / $50.00</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-amber-400 h-full w-[85%]" />
        </div>
        <div className="text-[10px] text-zinc-500">Velocity: 42 tx/min (Cap: 60)</div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Neural Decision Matrix",
    description: "Deep audit trails tracing agent prompt reasoning down to individual API calls and budget allocations.",
    icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
    badge: "Neural Audit v2",
    customContent: (
      <div className="font-mono text-[11px] p-2.5 rounded-xl bg-black/70 border border-purple-500/20 text-purple-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Decision Path:</span>
          <span className="text-purple-400 font-bold">Branch #4</span>
        </div>
        <div className="truncate text-zinc-300">Re-routed blocked node → CoinGecko Pro</div>
        <div className="text-[10px] text-purple-400/80">Confidence Score: 98.4%</div>
      </div>
    ),
  },
]

const stats = [
  { label: "Micro-tx Processed", value: "1.4M+", icon: Activity, color: "text-emerald-400" },
  { label: "Policy Enforcement", value: "99.99%", icon: Shield, color: "text-blue-400" },
  { label: "Settlement Latency", value: "<120ms", icon: Flame, color: "text-amber-400" },
  { label: "Active Agent Nodes", value: "8,500+", icon: Layers, color: "text-purple-400" },
]

export default function LandingPage() {
  const [simulating, setSimulating] = useState(false)
  const [demoLogs, setDemoLogs] = useState<string[]>([
    "[11:47:01] Telemetry Stream Initialized.",
    "[11:47:03] Agent #Research-Alpha connected via CAIP-2.",
    "[11:47:05] Policy Guard: Verified budget bounds ($42.50 / $50.00).",
  ])

  const handleStartSim = () => {
    setSimulating(true)
    const newLogs = [
      "[11:47:07] HTTP 402 Payment Required: SerpAPI ($0.01 USDC)",
      "[11:47:08] Policy Guard: ✓ Approved. Submitting to Facilitator...",
      "[11:47:09] x402 Settlement Complete: Tx 0x8F9...2A1B (180ms)",
      "[11:47:11] HTTP 402 Payment Required: Unknown Broker ($0.50 USDC)",
      "[11:47:12] Policy Guard: ✗ REJECTED. Merchant not in allowlist.",
      "[11:47:14] Agent re-routed execution → CoinGecko Pro ($0.05 USDC)",
      "[11:47:15] x402 Settlement Complete: Tx 0x3E6...8D9A (195ms)",
    ]

    newLogs.forEach((log, idx) => {
      setTimeout(() => {
        setDemoLogs((prev) => [...prev, log])
        if (idx === newLogs.length - 1) setSimulating(false)
      }, (idx + 1) * 1200)
    })
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#0D1117] text-white overflow-y-auto">
      {/* 1. Cinematic Background Image (Gold Coin Illusion, No Name) */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/x402_coin_bg.png"
          alt="x402 Fiduciary Micro-transaction Illusion"
          fill
          className="object-cover object-center opacity-45 mix-blend-screen scale-105 transition-transform duration-1000"
          priority
        />
        {/* Dark Vignette & Radial Light Blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-[#0D1117]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,#0D1117_85%)]" />
      </div>

      {/* 2. Three.js Interactive Particles & 3D Orbit Layer */}
      <ThreeCoinBackground />

      {/* 3. Header */}
      <header className="relative z-30 flex items-center justify-between px-6 lg:px-12 py-6 max-w-[1600px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            <svg viewBox="0 0 32 32" className="w-10 h-10 relative z-10" fill="none">
              <polygon
                points="16,2 27,7 30,18 27,27 16,30 5,27 2,18 5,7"
                className="stroke-amber-400 fill-amber-500/20 transition-colors group-hover:fill-amber-500/30"
                strokeWidth="1.5"
              />
              <circle cx="16" cy="16" r="4" className="fill-amber-400" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            x402<span className="text-amber-400 font-light">Guard</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black font-bold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-md"
          >
            Initialize Session
          </Link>
        </div>
      </header>

      {/* Live Telemetry Ticker */}
      <div className="relative z-20 w-full bg-black/40 border-y border-amber-500/20 py-2.5 overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-8 animate-[shimmer_20s_linear_infinite] whitespace-nowrap text-xs font-mono">
          <span className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE TELEMETRY: Agent #Research-Alpha settled 0.01 USDC via Base L2
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-2 text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Policy Guard: Approved CoinGecko Pro (0x8D9A)
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5" /> Blocked: 0xUnknown (Merchant allowlist POL-001)
          </span>
        </div>
      </div>

      {/* Main Hero Section */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center pt-10 pb-20 px-4 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            Real-Time Agent Telemetry · Base L2 Micro-Transactions
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1] text-white">
            Autonomous Fiduciary <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]">
              Micro-Transaction Precision
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
            The enterprise policy engine & live WebGL telemetry stream for auditing non-custodial CDP agent spending with millisecond precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-105 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative flex items-center gap-2">
                Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/orchestrator"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black/40 border border-white/20 hover:border-amber-400/50 text-white font-semibold text-base transition-all duration-300 hover:bg-white/10 w-full sm:w-auto gap-2 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" /> Open Orchestrator
            </Link>
          </div>
        </motion.div>

        {/* 3D Telemetry Carousel Section */}
        <div className="w-full my-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Interactive 3D Telemetry Showcase</h2>
            <p className="text-xs text-slate-400 mt-1">Rotate cards to inspect live agent governance modules</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="w-full"
          >
            <Carousel3D items={telemetrySlides} />
          </motion.div>
        </div>

        {/* Interactive Telemetry Live Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl bg-black/60 rounded-3xl p-6 sm:p-8 border border-white/20 my-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Live Telemetry Console Simulator</h3>
                <p className="text-xs text-slate-400">Test x402 policy guard streaming directly on the landing page</p>
              </div>
            </div>
            <Button
              onClick={handleStartSim}
              disabled={simulating}
              size="sm"
              className="gap-2 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              {simulating ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {simulating ? "Streaming..." : "Simulate Agent Stream"}
            </Button>
          </div>

          <div className="font-mono text-xs p-4 rounded-2xl bg-black/90 border border-white/10 max-h-[220px] overflow-y-auto space-y-2 text-zinc-300">
            {demoLogs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  log.includes("REJECTED") ? "text-red-400 font-semibold" : log.includes("Approved") || log.includes("Complete") ? "text-emerald-400" : "text-zinc-400"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Agent Avatars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl text-center my-8"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Connected Autonomous Agent Nodes</h3>
          <p className="text-xs text-slate-400 mb-6">Monitored character personas executing micro-transactions</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Research-Alpha", "Data-Scraper-V2", "Crypto-Analyst", "Policy-Engine"].map((agentName) => (
              <div key={agentName} className="bg-black/50 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/15 hover:border-amber-400/50 transition-all duration-300">
                <AgentAvatar name={agentName} size="md" status="active" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{agentName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Node
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-12 max-w-5xl"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-black/50 backdrop-blur-md rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-white/15 hover:border-amber-400/40 transition-all duration-300"
              >
                <Icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold font-mono tracking-tight text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-6 border-t border-white/10 text-center text-xs text-slate-500 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 x402Guard. Enterprise Autonomous Agent Governance.</div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-amber-400 transition-colors">Login</Link>
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
            <Link href="/orchestrator" className="hover:text-amber-400 transition-colors">Orchestrator</Link>
            <Link href="/policy" className="hover:text-amber-400 transition-colors">Policy Guard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
