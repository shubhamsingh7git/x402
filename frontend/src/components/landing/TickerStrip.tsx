"use client"

import { useState } from "react"
import { Zap } from "lucide-react"

const TICKER_ITEMS = [
  "TRENDING · x402 PROTOCOL LIVE ON BASE L2",
  "MARKETS · USDC SETTLEMENT VOLUME +340%",
  "AGENTS · 12 AUTONOMOUS LOOPS ACTIVE",
  "SECURITY · ZERO POLICY VIOLATIONS TODAY",
  "NETWORK · 99.99% UPTIME ACHIEVED",
  "GOVERNANCE · NEW SPENDING CAPS DEPLOYED",
  "RESEARCH · AI AGENT MEMORY INDEXING LIVE",
  "PROTOCOL · SUB-SECOND FINALITY CONFIRMED",
]

export function TickerStrip() {
  const [paused, setPaused] = useState(false)
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      className="w-full overflow-hidden border-y border-border bg-primary/5 py-3 select-none relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex w-max gap-8"
        style={{
          animation: "carousel-scroll 32s linear infinite",
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-foreground/70 uppercase whitespace-nowrap hover:text-primary transition-colors duration-200 cursor-default"
          >
            <Zap className="w-3 h-3 text-primary opacity-70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
