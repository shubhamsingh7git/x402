"use client"

import { useState, useRef, useCallback } from "react"
import { NetworkScene } from "./NetworkScene"
import gsap from "gsap"

interface PreloaderOverlayProps {
  children: React.ReactNode
}

export function PreloaderOverlay({ children }: PreloaderOverlayProps) {
  const [isBooting, setIsBooting] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleAnimationComplete = useCallback(() => {
    // Fade out the 3D preloader overlay
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          setIsBooting(false)
          setShowContent(true)
        },
      })
    } else {
      setIsBooting(false)
      setShowContent(true)
    }
  }, [])

  return (
    <>
      {/* 3D Preloader overlay — sits on top of everything */}
      {isBooting && (
        <div ref={overlayRef} style={{ opacity: 1 }}>
          <NetworkScene onAnimationComplete={handleAnimationComplete} />
        </div>
      )}

      {/* Main app content — fades in after preloader completes */}
      <div
        className={`transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </>
  )
}
