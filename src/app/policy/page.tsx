"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, ShieldAlert, Trash2, ShieldCheck, Gauge, Users, Check, AlertOctagon, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"

export default function PolicyGuardPage() {
  const {
    killSwitchActive,
    toggleKillSwitch,
    maxPerTxAmount,
    setMaxPerTxAmount,
    dailyBudgetLimit,
    setDailyBudgetLimit,
    maxTxPerMinute,
    setMaxTxPerMinute,
    merchants,
    addMerchant,
    deleteMerchant,
  } = useAppStore()

  const [savedField, setSavedField] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Add Merchant Modal State
  const [newAlias, setNewAlias] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newNetwork, setNewNetwork] = useState("Base Sepolia Testnet")

  const handleSaveField = (key: string) => {
    setSavedField(key)
    setTimeout(() => setSavedField(null), 1800)
  }

  const handleCreateMerchant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAlias || !newAddress) return
    addMerchant({
      alias: newAlias,
      address: newAddress,
      network: newNetwork,
      status: "Verified",
    })
    setNewAlias("")
    setNewAddress("")
    setShowAddModal(false)
  }

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-screen bg-[#F3F4F6] dark:bg-[#1A1A24] transition-colors duration-300">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#2A2A35] p-6 rounded-2xl border border-border/40 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Spend Policy Guard Engine
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Absolute cryptographic parameters & middleware interception layer
              </p>
            </div>
          </div>
        </div>

        {/* Global Kill Switch Header Control */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-red-500">Global Kill Switch</span>
            <span className="text-[10px] text-muted-foreground">
              {killSwitchActive ? "All spending PAUSED" : "Spending Active"}
            </span>
          </div>
          <Switch
            checked={killSwitchActive}
            onCheckedChange={toggleKillSwitch}
            className="data-[state=checked]:bg-red-600"
          />
        </div>
      </motion.div>

      {/* Section 1: Thresholds Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Maximum Per-Transaction Amount */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#2A2A35] border border-border/40 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Max Per-Transaction Amount</h3>
                <p className="text-xs text-muted-foreground">Hard cap on single x402 signatures</p>
              </div>
            </div>
            <span className="text-base font-bold font-mono text-blue-500">
              ${maxPerTxAmount.toFixed(2)} USDC
            </span>
          </div>

          <div className="space-y-3">
            <input
              type="range"
              min="0.01"
              max="1.00"
              step="0.01"
              value={maxPerTxAmount}
              onChange={(e) => setMaxPerTxAmount(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-500"
            />
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                step="0.01"
                value={maxPerTxAmount}
                onChange={(e) => setMaxPerTxAmount(parseFloat(e.target.value) || 0)}
                className="font-mono text-sm h-10 rounded-xl bg-transparent border-b-2 border-slate-300 dark:border-zinc-700 dark:focus:border-amber-500 focus:ring-2 focus:ring-blue-400 dark:focus:ring-0 text-foreground"
              />
              <Button
                onClick={() => handleSaveField("maxPerTx")}
                variant="outline"
                className="h-10 rounded-xl px-4 text-xs font-semibold shrink-0"
              >
                {savedField === "maxPerTx" ? <Check className="w-4 h-4 text-emerald-500" /> : "Save"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Daily Aggregate Budget Limit */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#2A2A35] border border-border/40 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Daily Aggregate Budget Limit</h3>
                <p className="text-xs text-muted-foreground">Rolling 24-hour total treasury spend limit</p>
              </div>
            </div>
            <span className="text-base font-bold font-mono text-emerald-500">
              ${dailyBudgetLimit.toFixed(2)} USDC
            </span>
          </div>

          <div className="space-y-3">
            <input
              type="range"
              min="1.00"
              max="100.00"
              step="1.00"
              value={dailyBudgetLimit}
              onChange={(e) => setDailyBudgetLimit(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-500"
            />
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                step="1.00"
                value={dailyBudgetLimit}
                onChange={(e) => setDailyBudgetLimit(parseFloat(e.target.value) || 0)}
                className="font-mono text-sm h-10 rounded-xl bg-transparent border-b-2 border-slate-300 dark:border-zinc-700 dark:focus:border-amber-500 focus:ring-2 focus:ring-blue-400 dark:focus:ring-0 text-foreground"
              />
              <Button
                onClick={() => handleSaveField("dailyCap")}
                variant="outline"
                className="h-10 rounded-xl px-4 text-xs font-semibold shrink-0"
              >
                {savedField === "dailyCap" ? <Check className="w-4 h-4 text-emerald-500" /> : "Save"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 3: Velocity Rules */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white dark:bg-[#2A2A35] border border-border/40 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Gauge className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Section 3: Velocity Rules (Loop Prevention)</h3>
              <p className="text-xs text-muted-foreground">Maximum allowable requests per minute</p>
            </div>
          </div>

          <div className="w-48">
            <select
              value={maxTxPerMinute}
              onChange={(e) => setMaxTxPerMinute(parseInt(e.target.value))}
              className="w-full h-10 px-3 text-xs font-mono font-bold bg-slate-50 dark:bg-[#1A1A24] border border-slate-300 dark:border-zinc-700 rounded-xl text-foreground cursor-pointer"
            >
              <option value={10}>10 tx / min (Strict)</option>
              <option value={30}>30 tx / min (Standard)</option>
              <option value={60}>60 tx / min (High Throughput)</option>
              <option value={120}>120 tx / min (Unrestricted)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Merchant Allowlist */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-[#2A2A35] border border-border/40 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Section 2: Merchant Allowlist Matrix</h3>
              <p className="text-xs text-muted-foreground">Verified CAIP-2 blockchain addresses authorized for signing</p>
            </div>
          </div>

          {/* Add Merchant Floating Action Button */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-black shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Merchant
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/20 dark:bg-[#1A1A24] bg-slate-50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Alias</TableHead>
                <TableHead className="text-xs font-semibold">CAIP-2 Address</TableHead>
                <TableHead className="text-xs font-semibold">Network</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Added At</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((merchant) => {
                const isVerified = merchant.status === "Verified"
                return (
                  <TableRow
                    key={merchant.id}
                    className="border-border/10 hover:bg-muted/20 transition-colors text-xs"
                  >
                    <TableCell className="font-bold text-foreground">{merchant.alias}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{merchant.address}</TableCell>
                    <TableCell className="text-muted-foreground">{merchant.network}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] rounded-md border-0 ${
                          isVerified
                            ? "bg-emerald-500/10 text-emerald-500 font-bold"
                            : "bg-red-500/10 text-red-500 font-bold"
                        }`}
                      >
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">{merchant.addedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => deleteMerchant(merchant.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Add Merchant Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#2A2A35] border border-border/50 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <h3 className="text-base font-bold text-foreground">Add CAIP-2 Merchant</h3>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMerchant} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Merchant Human Alias</Label>
                  <Input
                    placeholder="e.g. Legal Sandbox API"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    required
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">CAIP-2 Address</Label>
                  <Input
                    placeholder="eip155:84532:0x..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    required
                    className="h-10 text-xs font-mono rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Target Network</Label>
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-[#1A1A24] border border-slate-300 dark:border-zinc-700 rounded-xl text-foreground font-medium"
                  >
                    <option value="Base Sepolia Testnet">Base Sepolia Testnet</option>
                    <option value="Base Mainnet">Base Mainnet</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="h-10 rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="h-10 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500">
                    Add Authorized Merchant
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
