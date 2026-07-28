"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ShieldCheck, Key, Cpu, Sparkles, CheckCircle2, Lock } from "lucide-react"
import { Agent3DCanvas } from "@/components/auth/Agent3DCanvas"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { initializeCdp } = useAppStore()

  const [apiKeyId, setApiKeyId] = useState("cdp_key_8f92a1b3c4d5")
  const [apiKeySecret, setApiKeySecret] = useState("secret_x402_live_998877")
  const [showSecret, setShowSecret] = useState(false)
  const [network, setNetwork] = useState<"Base Sepolia Testnet" | "Base Mainnet">("Base Sepolia Testnet")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!apiKeyId.trim() || !apiKeySecret.trim()) {
      setError("Please provide both CDP API Key ID and API Key Secret.")
      return
    }

    setIsLoading(true)

    try {
      // Instantiates CdpX402Client in store, provisions session wallet & initial balance
      await initializeCdp(apiKeyId, apiKeySecret, network)
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to initialize CDP Facilitator client. Please verify credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 fixed inset-0 z-50 bg-[#0D1117] dark:bg-[#0D1117] text-foreground transition-colors duration-300">
      {/* Left Pane: Branding, Value Prop & 3D Node Graphic */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0D1117] via-[#111722] to-[#0A0D12] dark:from-[#0D1117] dark:via-[#111722] dark:to-[#0A0D12] border-r border-border/20 text-white">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                <polygon
                  points="16,2 27,7 30,18 27,27 16,30 5,27 2,18 5,7"
                  className="stroke-blue-400 fill-blue-500/30"
                  strokeWidth="1.5"
                />
                <circle cx="16" cy="16" r="3" className="fill-blue-400" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-200">
                x402<span className="text-slate-400 font-light">Guard</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Autonomous Fiduciary Orchestrator
              </p>
            </div>
          </div>
        </div>

        {/* Center 3D Visualizer Canvas */}
        <div className="relative z-10 my-auto h-[420px] w-full flex items-center justify-center">
          <Agent3DCanvas />
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" /> EIP-712 & HTTP 402 Non-Custodial Governance
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Dual Orchestration & Fiduciary Spending Control
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            Provision non-custodial CDP agent wallets, set immutable cryptographic policy rules, and negotiate micro-transactions in real time with millisecond audit precision.
          </p>
        </div>
      </div>

      {/* Right Pane: Action Area (CDP Init Form) */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-[#0D1117] transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-lg font-bold">x402Guard</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              CDP Provisioning
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Initialize the Coinbase Developer Platform client to activate your session wallet.
            </p>
          </div>

          {/* Action Area Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#161B22] border border-[#D1D5DB] dark:border-border/40 shadow-xl dark:shadow-2xl space-y-6">
            <form onSubmit={handleInitialize} className="space-y-5">
              {/* CDP API Key ID */}
              <div className="space-y-2">
                <Label htmlFor="apiKeyId" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  CDP API Key ID
                </Label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="apiKeyId"
                    type="text"
                    placeholder="cdp_key_..."
                    value={apiKeyId}
                    onChange={(e) => setApiKeyId(e.target.value)}
                    required
                    className="pl-10 h-11 font-mono text-sm bg-slate-50 dark:bg-[#0D1117] border-[#D1D5DB] dark:border-border/50 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* CDP API Key Secret */}
              <div className="space-y-2">
                <Label htmlFor="apiKeySecret" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  CDP API Key Secret
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="apiKeySecret"
                    type={showSecret ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={apiKeySecret}
                    onChange={(e) => setApiKeySecret(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11 font-mono text-sm bg-slate-50 dark:bg-[#0D1117] border-[#D1D5DB] dark:border-border/50 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] rounded-xl text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Network Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="network" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Blockchain Network
                </Label>
                <div className="relative">
                  <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <select
                    id="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full pl-10 pr-4 h-11 text-sm bg-slate-50 dark:bg-[#0D1117] border border-[#D1D5DB] dark:border-border/50 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] rounded-xl text-slate-900 dark:text-white font-medium appearance-none cursor-pointer"
                  >
                    <option value="Base Sepolia Testnet">Base Sepolia Testnet (eip155:84532)</option>
                    <option value="Base Mainnet">Base Mainnet (eip155:8453)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-mono">
                  {error}
                </div>
              )}

              {/* Primary CTA Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-sm font-bold tracking-wide rounded-xl transition-all duration-200 bg-[#1E3A8A] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Instantiating CdpX402Client...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Initialize Orchestrator
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-200 dark:border-border/30 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CDP Facilitator Ready
              </span>
              <span className="font-mono">v2.4.0-x402</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
