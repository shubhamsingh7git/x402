"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  loading?: boolean
  success?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function HeroButton({
  loading = false,
  success = false,
  icon,
  children,
  className,
  onClick,
  ...props
}: HeroButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const [pressed, setPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleId = useRef(0)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || success) return

      // Create ripple
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        const id = ++rippleId.current
        setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800)
      }

      onClick?.(e)
    },
    [loading, success, onClick]
  )

  const isAnimating = loading || success

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl font-mono text-sm font-bold tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/25",
        "transition-shadow duration-300 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !isAnimating && "cursor-pointer hover:shadow-xl hover:shadow-primary/35",
        isAnimating && "pointer-events-none",
        className
      )}
      style={{
        height: 48,
        minWidth: loading ? 48 : undefined,
      }}
      animate={{
        width: loading ? 48 : "100%",
        borderRadius: loading ? 24 : 16,
        scale: pressed ? 0.97 : 1,
      }}
      transition={{
        width: { type: "spring", stiffness: 300, damping: 25 },
        borderRadius: { type: "spring", stiffness: 300, damping: 25 },
        scale: { type: "spring", stiffness: 500, damping: 30 },
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={handleClick}
      disabled={props.disabled || loading || success}
      {...props}
    >
      {/* Gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: success
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8), hsl(var(--primary)))",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: !isAnimating ? ["0% 0%", "100% 100%", "0% 0%"] : "0% 0%",
        }}
        transition={{
          backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Hover glow overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 60%)",
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 h-full text-primary-foreground">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center justify-center"
            >
              {/* Progress ring spinner */}
              <svg width="24" height="24" viewBox="0 0 24 24" className="animate-spin">
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="2" fill="none"
                  strokeLinecap="round"
                  strokeDasharray="31.4 31.4"
                  opacity="0.3"
                />
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="2.5" fill="none"
                  strokeLinecap="round"
                  strokeDasharray="20 43"
                />
              </svg>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <motion.path
                  d="M4 10L8 14L16 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              </svg>
              <span>Authenticated</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              <span>{children}</span>
              {icon && (
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {icon}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success pulse rings */}
      <AnimatePresence>
        {success && (
          <>
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                transition={{ duration: 1, delay, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
