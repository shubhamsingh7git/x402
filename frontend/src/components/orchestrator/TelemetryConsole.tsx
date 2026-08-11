"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal, Pause, Play, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LogEntry {
  id: string
  timestamp: string
  level: "INFO" | "WARN" | "SUCCESS" | "POLICY" | "X402"
  message: string
}

const initialLogs: LogEntry[] = [
  { id: "1", timestamp: "22:15:00.001", level: "INFO", message: "Orchestrator session initialized via CdpX402Client" },
  { id: "2", timestamp: "22:15:00.045", level: "INFO", message: "User Query received: 'Research DPDP Act compliance rubrics...'" },
  { id: "3", timestamp: "22:15:00.120", level: "X402", message: "GET https://api.legalsandbox.gov/v1/dpdp -> HTTP 402 Payment Required" },
  { id: "4", timestamp: "22:15:00.138", level: "POLICY", message: "Policy Guard Interception: Evaluating maxTxAmount ($0.02 <= $0.05 USDC)" },
  { id: "5", timestamp: "22:15:00.142", level: "SUCCESS", message: "Policy Guard: APPROVED. EIP-712 signature authorized." },
  { id: "6", timestamp: "22:15:00.210", level: "X402", message: "x402 Facilitator: Settled txHash 0x8f92a1b3... on Base Sepolia" },
]

export function TelemetryConsole({ activeExecution = false }: { activeExecution?: boolean }) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [isPaused, setIsPaused] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeExecution || isPaused) return

    const streamEvents: Omit<LogEntry, "id" | "timestamp">[] = [
      { level: "X402", message: "Node 1 Legal Sandbox API: Challenge received (402 Payment Required)" },
      { level: "POLICY", message: "Middleware Interception: Checking CAIP-2 eip155:84532 allowlist..." },
      { level: "SUCCESS", message: "Allowlist verified: Legal Sandbox API (eip155:84532:0x3F82...19A2)" },
      { level: "X402", message: "CDP Session Wallet: Signing $0.02 USDC EIP-712 payload" },
      { level: "SUCCESS", message: "Node 1 Settled! HTTP 200 Response received with DPDP Rubrics payload" },
      { level: "INFO", message: "Pipeline Step 2: Querying Deceptive Pattern Taxonomy DB" },
      { level: "X402", message: "GET https://api.deceptivepattern.org/taxonomy -> HTTP 402 Challenge ($0.04 USDC)" },
      { level: "POLICY", message: "Policy Guard: $0.04 USDC <= $0.05 USDC cap (APPROVED)" },
      { level: "SUCCESS", message: "Node 2 Settled! Tx Hash 0x3e6d8a7b9c1d2e3f4a5b6c7d" },
      { level: "INFO", message: "Node 3 LLM Synthesizer: Generating final compliance matrix report..." },
      { level: "SUCCESS", message: "Pipeline Execution Complete. Report ready for review." },
    ]

    let idx = 0
    const interval = setInterval(() => {
      if (idx >= streamEvents.length) {
        clearInterval(interval)
        return
      }

      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`

      const event = streamEvents[idx]
      setLogs((prev) => [...prev, { ...event, id: `stream-${Date.now()}-${idx}`, timestamp: timeStr }])
      idx++
    }, 900)

    return () => clearInterval(interval)
  }, [activeExecution, isPaused])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" })
  }, [logs])

  const levelColors: Record<string, string> = {
    INFO: "text-blue-400 dark:text-blue-400 font-bold",
    WARN: "text-amber-400 dark:text-amber-400 font-bold",
    SUCCESS: "text-emerald-500 dark:text-emerald-400 font-bold",
    POLICY: "text-[#10B981] dark:text-[#10B981] font-bold",
    X402: "text-purple-600 dark:text-purple-400 font-bold",
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F4EF] dark:bg-[#000000] text-[#1A1A1A] dark:text-[#00FF66] font-mono text-xs overflow-hidden transition-colors duration-300">
      {/* Console Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#EAE8E0] dark:bg-[#0D0D0D] border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-[#00FF66]" />
          <span className="font-bold tracking-wider uppercase text-[11px]">x402 Live Telemetry Stream</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsPaused(!isPaused)}
            variant="ghost"
            size="icon"
            className="w-7 h-7 hover:bg-black/10 dark:hover:bg-white/10"
            title={isPaused ? "Resume Stream" : "Pause Stream"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </Button>
          <Button
            onClick={() => setLogs([])}
            variant="ghost"
            size="icon"
            className="w-7 h-7 hover:bg-black/10 dark:hover:bg-white/10"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Terminal Stream Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-[11px] leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5 hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded transition-colors">
            <span className="text-muted-foreground opacity-60 shrink-0">[{log.timestamp}]</span>
            <span className={`shrink-0 ${levelColors[log.level] || ""}`}>[{log.level}]</span>
            <span className="break-all">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
