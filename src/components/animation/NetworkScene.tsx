"use client"

import { useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import { ApiNodes } from "./ApiNodes"
import * as THREE from "three"
import gsap from "gsap"

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
      duration: 3.2,
      ease: "power2.inOut",
    })
    gsap.to(camera as THREE.OrthographicCamera, {
      zoom: 25,
      duration: 3.2,
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
  return (
    <div
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden"
      style={{ background: "#0D1117" }}
    >
      <Canvas
        orthographic
        camera={{ position: [15, 15, 15], zoom: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100vw", height: "100vh", background: "#0D1117" }}
      >
        <CameraAnimator />
        <ambientLight intensity={0.25} color="#1E293B" />
        <directionalLight position={[20, 40, 20]} intensity={1.2} castShadow />
        <pointLight position={[-5, 3, 5]} color="#EF4444" intensity={4.0} distance={12} />
        <pointLight position={[5, 3, -5]} color="#10B981" intensity={4.0} distance={12} />
        <pointLight position={[0, 4, 0]} color="#3B82F6" intensity={3.5} distance={15} />

        <Grid
          position={[0, -0.01, 0]}
          args={[100, 100]}
          sectionColor="#06B6D4"
          cellColor="#1E293B"
          fadeDistance={50}
          infiniteGrid
        />

        <ApiNodes onComplete={onAnimationComplete} />
      </Canvas>

      {/* HUD */}
      <div className="absolute bottom-10 left-10 z-10 font-mono text-xs space-y-2 pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold tracking-wider text-emerald-400 uppercase">
            Initializing System Telemetry...
          </span>
        </div>
        <div className="text-slate-500 text-[11px] flex gap-4">
          <span className="text-[#10B981]">● Settled x402</span>
          <span className="text-[#3B82F6]">● Active AI Pathways</span>
          <span className="text-[#EF4444]">● Policy Violations</span>
        </div>
      </div>
    </div>
  )
}
