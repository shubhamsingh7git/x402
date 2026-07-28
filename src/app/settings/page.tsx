"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Key, Wallet, Bell, Copy, Eye, EyeOff, Plus, RotateCcw, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState("x402_live_sk_8f92a1b3c4d5e6f7a8b9c0d1e2f3a4b5")
  const [wallets, setWallets] = useState([
    { address: "0x7F2A...3B92", label: "Coinbase Smart Wallet", network: "Base L2", active: true },
  ])

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRotateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    setApiKey(`x402_live_sk_${randomHex}`)
  }

  const handleAddWallet = () => {
    const newWallet = {
      address: `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}...${Math.floor(Math.random() * 4095).toString(16).toUpperCase()}`,
      label: "Secondary Agent Keyring",
      network: "Optimism L2",
      active: true,
    }
    setWallets((prev) => [...prev, newWallet])
  }

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-[900px] mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage API keys, wallets, and notification preferences</p>
      </motion.div>

      {/* API Keys Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
            <Key className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">API Keys</h3>
            <p className="text-xs text-muted-foreground">Authentication for the x402 Facilitator RPC</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Live API Key</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="font-mono text-xs h-10 bg-muted/30 border-border/50 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button onClick={handleCopyKey} variant="outline" size="sm" className="h-10 rounded-lg px-3">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              <Button onClick={handleRotateKey} variant="outline" size="sm" className="h-10 rounded-lg px-3 text-red-500 hover:text-red-500 hover:bg-red-500/10" title="Rotate Key">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-xs">Rate Limiting</Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">Enforce 1000 req/min on this key</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Wallet Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Wallet Configuration</h3>
            <p className="text-xs text-muted-foreground">Connected wallets for x402 signing</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {wallets.map((wallet, idx) => (
              <motion.div
                key={wallet.address + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-mono">{wallet.address}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{wallet.label} · {wallet.network}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-0 bg-emerald-500/10 text-emerald-500 rounded-md">
                  Active
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button onClick={handleAddWallet} variant="outline" size="sm" className="gap-2 rounded-xl h-9 text-xs w-full">
            <Plus className="w-3.5 h-3.5" /> Connect Another Wallet
          </Button>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">Alert preferences for policy events</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Policy Block Alerts", description: "Notify on every rejected transaction", checked: true },
            { label: "Budget Warning (80%)", description: "Alert when daily limit reaches 80%", checked: true },
            { label: "Budget Critical (95%)", description: "Urgent alert at 95% spend", checked: true },
            { label: "Agent Completion", description: "Notify when an agent finishes execution", checked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <Label className="text-sm">{item.label}</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <Switch defaultChecked={item.checked} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
