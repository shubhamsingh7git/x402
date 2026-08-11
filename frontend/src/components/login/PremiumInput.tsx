"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  error?: string
  success?: boolean
  wrapperClassName?: string
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ icon: Icon, label, error, success, className, wrapperClassName, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const innerRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef

    const hasError = !!error
    const hasSuccess = success && !hasError

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <motion.label
            className="block text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono"
            animate={{
              color: focused
                ? "hsl(var(--primary))"
                : hasError
                ? "hsl(var(--destructive))"
                : undefined,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <div
          className="relative group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute -inset-[1px] rounded-xl opacity-0 pointer-events-none"
            style={{
              background: hasError
                ? "linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.5), hsl(var(--destructive)))"
                : hasSuccess
                ? "linear-gradient(135deg, #10b981, #059669, #10b981)"
                : "linear-gradient(var(--gradient-angle, 135deg), hsl(var(--primary)), hsl(var(--primary) / 0.4), hsl(var(--primary)))",
              backgroundSize: "300% 300%",
            }}
            animate={{
              opacity: focused ? 1 : hovered ? 0.5 : 0,
              backgroundPosition: focused ? ["0% 0%", "100% 100%", "0% 0%"] : "0% 0%",
            }}
            transition={{
              opacity: { duration: 0.2 },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            style={{
              background: hasError
                ? "radial-gradient(circle, hsl(var(--destructive) / 0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
            }}
            animate={{ opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative"
            animate={hasError ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
            transition={hasError ? { duration: 0.4, ease: "easeInOut" } : {}}
          >
            {/* Icon */}
            {Icon && (
              <motion.div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                animate={{
                  scale: focused ? 1.1 : 1,
                  color: focused
                    ? "hsl(var(--primary))"
                    : hasError
                    ? "hsl(var(--destructive))"
                    : undefined,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}

            {/* Input */}
            <input
              ref={ref}
              className={cn(
                "w-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl text-sm text-foreground font-mono",
                "placeholder:text-muted-foreground/50 transition-colors duration-200",
                "focus:outline-none focus:bg-card/80",
                Icon ? "pl-10 pr-10" : "px-4",
                "py-3",
                hasError && "border-destructive/50 bg-destructive/5",
                hasSuccess && "border-emerald-500/50 bg-emerald-500/5",
                className
              )}
              onFocus={(e) => {
                setFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocused(false)
                props.onBlur?.(e)
              }}
              {...props}
            />

            {/* Success checkmark */}
            <AnimatePresence>
              {hasSuccess && (
                <motion.div
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error icon */}
            <AnimatePresence>
              {hasError && (
                <motion.div
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <AlertCircle className="w-4 h-4 text-destructive" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {hasError && (
            <motion.p
              className="text-[11px] text-destructive font-mono flex items-center gap-1.5 pl-1"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
PremiumInput.displayName = "PremiumInput"
