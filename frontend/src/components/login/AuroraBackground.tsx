"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

/**
 * AuroraBackground — Cinematic animated background for login/auth pages.
 * Features:
 * - Animated gradient mesh aurora using CSS animations
 * - Floating blurred glass orbs with slow drift
 * - Noise texture overlay
 * - Mouse-based parallax depth on orbs
 * - Soft radial light rays
 */
export function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
    containerRef.current.style.setProperty("--mx", `${(mouseRef.current.x - 0.5) * 40}px`)
    containerRef.current.style.setProperty("--my", `${(mouseRef.current.y - 0.5) * 40}px`)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ "--mx": "0px", "--my": "0px" } as React.CSSProperties}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* Aurora gradient mesh */}
      <div className="absolute inset-0 opacity-30 dark:opacity-40">
        <div
          className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%] animate-aurora-1"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(var(--aurora-1)) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(var(--aurora-2)) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(var(--aurora-3)) 0%, transparent 60%)
            `,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] animate-aurora-2"
          style={{
            background: `
              radial-gradient(ellipse at 60% 30%, hsl(var(--aurora-2)) 0%, transparent 45%),
              radial-gradient(ellipse at 20% 70%, hsl(var(--aurora-3)) 0%, transparent 45%)
            `,
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Floating glass orbs with parallax */}
      {[
        { size: 300, x: "15%", y: "20%", delay: 0, depth: 1.5, color: "hsl(var(--aurora-1))" },
        { size: 200, x: "75%", y: "15%", delay: 2, depth: 1.0, color: "hsl(var(--aurora-2))" },
        { size: 250, x: "60%", y: "70%", delay: 4, depth: 2.0, color: "hsl(var(--aurora-3))" },
        { size: 180, x: "25%", y: "75%", delay: 1, depth: 0.8, color: "hsl(var(--aurora-1))" },
        { size: 150, x: "85%", y: "50%", delay: 3, depth: 1.2, color: "hsl(var(--aurora-2))" },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${40 + i * 10}px)`,
            opacity: 0.15,
            transform: `translate(calc(var(--mx) * ${orb.depth}), calc(var(--my) * ${orb.depth}))`,
            willChange: "transform",
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 10, -10, 5, 0],
            scale: [1, 1.05, 0.98, 1.02, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Soft radial light rays */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[70%] opacity-10 dark:opacity-15"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent 30%, hsl(var(--aurora-1) / 0.3) 35%, transparent 40%, transparent 55%, hsl(var(--aurora-2) / 0.2) 60%, transparent 65%)",
          filter: "blur(40px)",
          transform: `translate(calc(var(--mx) * 0.3), calc(var(--my) * 0.3))`,
        }}
      />

      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_75%)] opacity-95" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.03] dark:opacity-[0.05]" />
    </div>
  )
}
