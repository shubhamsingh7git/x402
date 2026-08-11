"use client"

import React, { useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function TiltCard({ children, className, glowColor = "hsl(var(--primary))" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovering, setHovering] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setHovering(true)
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect()
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rectRef.current) return
    const rect = rectRef.current
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setTilt({
      x: (y - 0.5) * -12, // tilt around X axis
      y: (x - 0.5) * 12,  // tilt around Y axis
    })
    setGlowPos({ x: x * 100, y: y * 100 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setHovering(false)
    rectRef.current = null
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative group cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: hovering ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      style={{
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 pointer-events-none z-0"
        style={{
          background: `linear-gradient(135deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
        }}
        animate={{ opacity: hovering ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Hover glow spotlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none z-0 overflow-hidden"
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{
            left: `${glowPos.x}%`,
            top: `${glowPos.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      </motion.div>

      {/* Card content */}
      <div
        className="relative z-10 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: hovering
            ? `0 20px 40px -15px ${glowColor}25, 0 8px 20px -8px rgba(0,0,0,0.15)`
            : "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>

      {/* Click ripple */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 overflow-hidden"
        whileTap={{
          scale: 0.98,
        }}
      />
    </motion.div>
  )
}
