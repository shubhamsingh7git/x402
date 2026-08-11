"use client"

import { useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import { ApiNodes } from "./ApiNodes"
import * as THREE from "three"
import gsap from "gsap"
import { useTheme } from "next-themes"

/** Smooth camera pull-back for the building scene */
function CameraAnimator() {
  const { camera } = useThree()
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    camera.position.set(15, 15, 15)
    ;(camera as THREE.OrthographicCamera).zoom = 45
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    gsap.to(camera.position, {
      x: 35, y: 35, z: 35,
      duration: 0.8,
      ease: "power2.inOut",
    })
    gsap.to(camera as THREE.OrthographicCamera, {
      zoom: 25,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
    })
  }, [camera])

  useFrame(() => { camera.lookAt(0, 0, 0) })
  return null
}

interface NetworkSceneProps {
  onAnimationComplete?: () => void
}

export function NetworkScene({ onAnimationComplete }: NetworkSceneProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const bgColor = isDark ? "#0D1117" : "#FAF7EE"

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden"
      style={{ background: bgColor }}
    >
      <Canvas
        orthographic
        camera={{ position: [15, 15, 15], zoom: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100vw", height: "100vh", background: bgColor }}
      >
        <CameraAnimator />
        <ambientLight intensity={isDark ? 0.25 : 0.75} color={isDark ? "#1E293B" : "#ffffff"} />
        <directionalLight position={[20, 40, 20]} intensity={isDark ? 1.2 : 1.4} castShadow />
        <pointLight position={[-5, 3, 5]} color={isDark ? "#EF4444" : "#dc2626"} intensity={3.5} distance={12} />
        <pointLight position={[5, 3, -5]} color={isDark ? "#10B981" : "#059669"} intensity={3.5} distance={12} />
        <pointLight position={[0, 4, 0]} color={isDark ? "#3B82F6" : "#2563eb"} intensity={3.0} distance={15} />

        <Grid
          position={[0, -0.01, 0]}
          args={[100, 100]}
          sectionColor={isDark ? "#06B6D4" : "#d97706"}
          cellColor={isDark ? "#1E293B" : "#e2e8f0"}
          fadeDistance={50}
          infiniteGrid
        />

        <ApiNodes onComplete={onAnimationComplete} />
      </Canvas>

      {/* HUD */}
      <div className="absolute bottom-10 left-10 z-10 font-mono text-xs space-y-2 pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Initializing System Telemetry...
          </span>
        </div>
        <div className="text-muted-foreground text-[11px] flex gap-4 font-semibold">
          <span className="text-emerald-600 dark:text-[#10B981]">● Settled x402</span>
          <span className="text-blue-600 dark:text-[#3B82F6]">● Active AI Pathways</span>
          <span className="text-rose-600 dark:text-[#EF4444]">● Policy Violations</span>
        </div>
      </div>
    </div>
  )
}
