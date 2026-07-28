"use client"

import { useState } from "react"
import { AgentPipelineMap } from "@/components/orchestrator/AgentPipelineMap"
import { TelemetryConsole } from "@/components/orchestrator/TelemetryConsole"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayCircle, StopCircle, Sparkles, Cpu, Clock, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export default function OrchestratorPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [prompt, setPrompt] = useState("Research DPDP Act compliance rubrics and map recent deceptive design patterns.")

  const handleLaunch = () => {
    if (!prompt.trim()) return
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC] dark:bg-[#121212] transition-colors duration-300">
      <div className="p-6 lg:p-8 pb-0 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Agent Orchestrator & Live Research Pipeline
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-step AI reasoning and autonomous payment negotiation with HTTP 402 challenges
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isRunning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 text-xs text-muted-foreground"
              >
                <span className="flex items-center gap-1.5 glass-card rounded-lg px-3 py-1.5 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" /> Research-Alpha
                </span>
                <span className="flex items-center gap-1.5 glass-card rounded-lg px-3 py-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> 6.5s elapsed
                </span>
                <span className="flex items-center gap-1.5 glass-card rounded-lg px-3 py-1.5 font-mono">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> $0.06 spent
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Top Command Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-2 mb-6 border border-border/50 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                placeholder="e.g., Research DPDP Act compliance rubrics and map recent deceptive design patterns."
                className="pl-12 h-12 text-sm sm:text-base bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60 text-foreground font-medium"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
                onKeyDown={(e) => e.key === "Enter" && handleLaunch()}
              />
            </div>
            {!isRunning ? (
              <Button
                onClick={handleLaunch}
                size="lg"
                className="h-11 px-6 gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20"
              >
                <PlayCircle className="w-5 h-5" /> Launch Pipeline
              </Button>
            ) : (
              <Button
                onClick={handleStop}
                size="lg"
                variant="destructive"
                className="h-11 px-6 gap-2 rounded-xl shadow-lg shadow-red-500/20 font-bold"
              >
                <StopCircle className="w-5 h-5" /> Halt Agent
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Content Area: Left Canvas (Pipeline Visualizer) & Right Sidebar (Live Telemetry) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-6 lg:px-8 pb-6 lg:pb-8 min-h-0 max-w-[1600px] mx-auto w-full">
        {/* Main Canvas: React Flow Pipeline Visualizer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-[440px] glass-card rounded-2xl overflow-hidden border border-border/40"
        >
          <div className="px-5 py-3.5 border-b border-border/30 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Pipeline Flowchart Visualizer</h3>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Negotiating (402)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Settled</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Blocked</span>
            </div>
          </div>
          <div className="flex-1">
            <AgentPipelineMap activeExecution={isRunning} />
          </div>
        </motion.div>

        {/* Right Sidebar: Live Telemetry Monospace Terminal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-[420px] xl:w-[480px] flex flex-col shrink-0 glass-card rounded-2xl overflow-hidden border border-border/40 shadow-xl"
        >
          <div className="flex-1 min-h-[380px]">
            <TelemetryConsole activeExecution={isRunning} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
