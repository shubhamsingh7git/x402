"use client"

import { useState, useRef, useCallback } from "react"
import { NetworkScene } from "./NetworkScene"
import { AgentNetworkOverlay } from "./AgentNetworkOverlay"
import gsap from "gsap"

interface PreloaderOverlayProps {
  children: React.ReactNode
}

/**
 * Three-phase preloader:
 *   1. `booting`  — 3D isometric buildings grow then collapse
 *   2. `network`  — 3D AI Agent Network with chip + orbiting nodes
 *   3. `content`  — main app revealed
 */
export function PreloaderOverlay({ children }: PreloaderOverlayProps) {
  const [phase, setPhase] = useState<"booting" | "network" | "content">("booting")
  const overlayRef = useRef<HTMLDivElement>(null)

  // Called when buildings have fully collapsed → switch to network phase
  const handleAnimationComplete = useCallback(() => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setPhase("network")
        },
      })
    } else {
      setPhase("network")
    }
  }, [])

  // Called when the agent network overlay finishes its display cycle
  const handleNetworkComplete = useCallback(() => {
    setPhase("content")
  }, [])

  return (
    <>
      {/* Phase 1: 3D Preloader — isometric buildings */}
      {phase === "booting" && (
        <div ref={overlayRef} style={{ opacity: 1 }}>
          <NetworkScene onAnimationComplete={handleAnimationComplete} />
        </div>
      )}

      {/* Phase 2: 3D AI Agent Network */}
      {phase === "network" && (
        <AgentNetworkOverlay onComplete={handleNetworkComplete} />
      )}

      {/* Phase 3: Main app content */}
      <div
        className={`transition-opacity duration-700 ${
          phase === "content" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </>
  )
}
