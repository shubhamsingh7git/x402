"use client"

import { Bell, Search, AlertOctagon, ShieldAlert, Check, Copy, ChevronRight, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAppStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import Link from "next/link"

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orchestrator": "Orchestrator Pipeline",
  "/policy": "Policy Guard",
  "/audit": "Audit Ledger",
  "/settings": "Infrastructure Settings",
}

export function TopNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [copiedWallet, setCopiedWallet] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)

  const {
    isCdpConnected,
    selectedNetwork,
    sessionWalletAddress,
    killSwitchActive,
    toggleKillSwitch,
  } = useAppStore()

  useEffect(() => {
    const handleScroll = () => {
      const main = document.querySelector("main")
      if (main) {
        setScrolled(main.scrollTop > 10)
      }
    }
    const main = document.querySelector("main")
    main?.addEventListener("scroll", handleScroll)
    return () => main?.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCopyWallet = () => {
    navigator.clipboard?.writeText(sessionWalletAddress)
    setCopiedWallet(true)
    setTimeout(() => setCopiedWallet(false), 2000)
  }

  const currentTitle = routeTitles[pathname] || "Workspace"

  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30
        transition-all duration-300
        ${scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-md"
          : "bg-background/40 backdrop-blur-lg border-b border-border/40"
        }
      `}
    >
      {/* Left Area: Breadcrumbs & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
              <polygon
                points="16,2 27,7 30,18 27,27 16,30 5,27 2,18 5,7"
                className="stroke-primary fill-primary/20"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </Link>

        {/* Breadcrumb Navigation */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span className="hover:text-foreground transition-colors">x402 Guard</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-foreground font-semibold tracking-tight">{currentTitle}</span>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs hidden sm:block group">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Search telemetry, agents, txs..."
              className="w-full bg-muted/30 backdrop-blur-md pl-9 pr-10 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl h-9 text-xs transition-all duration-200 focus-visible:bg-background"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-4 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1 font-mono text-[9px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions Header Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active CDP Facilitator Status Indicator */}
        <div
          title={isCdpConnected ? "CDP Facilitator Active" : "CDP Facilitator Disconnected"}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
            isCdpConnected
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          <div className="relative flex h-2 w-2 items-center justify-center">
            {isCdpConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isCdpConnected ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>
          <span className="hidden xl:inline">CDP Facilitator:</span>
          <span>{isCdpConnected ? "Active" : "Offline"}</span>
        </div>

        {/* Active Network Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-semibold backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 shrink-0" />
          <span>{selectedNetwork}</span>
        </div>

        {/* Kill Switch Toggle */}
        <Button
          onClick={toggleKillSwitch}
          variant={killSwitchActive ? "destructive" : "outline"}
          size="sm"
          className={`relative group gap-1.5 rounded-xl h-9 text-xs font-medium transition-all duration-300 ${
            killSwitchActive
              ? "bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
              : "border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          }`}
        >
          {killSwitchActive ? (
            <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <AlertOctagon className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {killSwitchActive ? "SPEND HALTED" : "Kill Switch"}
          </span>
        </Button>

        <div className="w-px h-5 bg-border/40 mx-0.5 hidden sm:block" />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications((prev) => !prev)
              setUnreadNotifications(false)
            }}
            className="relative text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border border-border/60 bg-background/95 backdrop-blur-2xl p-4 shadow-2xl z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider">System Telemetry</h4>
                  <span className="text-[10px] text-muted-foreground">Real-time</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-foreground">
                    <p className="font-semibold text-emerald-500">Policy Check Passed</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Agent #402 settled 0.02 USDC via Base Sepolia</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground">
                    <p className="font-semibold text-amber-500">Velocity Warning</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Rate limit at 30 req/min threshold</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wallet Copy Pill */}
        <button
          onClick={handleCopyWallet}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 active:scale-95 cursor-pointer group transition-all duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
            {copiedWallet ? "Copied!" : `${sessionWalletAddress.slice(0, 6)}...${sessionWalletAddress.slice(-4)}`}
          </span>
          {copiedWallet ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
          )}
        </button>
      </div>
    </motion.header>
  )
}
