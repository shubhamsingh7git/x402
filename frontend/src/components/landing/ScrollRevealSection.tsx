"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

type RevealAnimation =
  | "fadeUp"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "maskReveal"
  | "rotateIn"
  | "slideUp"
  | "depthPush"

const animationVariants: Record<RevealAnimation, { hidden: any; visible: any }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  maskReveal: {
    hidden: { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
    visible: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  },
  rotateIn: {
    hidden: { opacity: 0, rotateX: 15, y: 40, transformPerspective: 800 },
    visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 800 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  depthPush: {
    hidden: { opacity: 0, z: -100, scale: 0.9, filter: "blur(8px)" },
    visible: { opacity: 1, z: 0, scale: 1, filter: "blur(0px)" },
  },
}

interface ScrollRevealSectionProps {
  children: React.ReactNode
  animation?: RevealAnimation
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function ScrollRevealSection({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.7,
  className = "",
  once = true,
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  const variants = animationVariants[animation]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: "easeOut" as const,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
