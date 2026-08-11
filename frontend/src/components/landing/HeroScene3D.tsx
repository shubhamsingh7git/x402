"use client"

import { Suspense, useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { FloatingNodes } from "./FloatingNodes"
import * as THREE from "three"

/* ─── Camera rig with mouse tracking + scroll ─── */
function CameraRig() {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0, z: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouse, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Cinematic drift
    const baseX = Math.sin(time * 0.1) * 0.5
    const baseY = Math.cos(time * 0.08) * 0.3 + 2
    const baseZ = 10 - scrollRef.current * 6

    // Mouse influence (lerped)
    targetRef.current.x = baseX + mouseRef.current.x * 1.5
    targetRef.current.y = baseY - mouseRef.current.y * 0.8
    targetRef.current.z = baseZ

    camera.position.x += (targetRef.current.x - camera.position.x) * delta * 1.5
    camera.position.y += (targetRef.current.y - camera.position.y) * delta * 1.5
    camera.position.z += (targetRef.current.z - camera.position.z) * delta * 1.5

    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── Ambient volumetric fog plane ─── */
function FogPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -3, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#ff6b00"
        emissive="#ff4500"
        emissiveIntensity={0.05}
        transparent
        opacity={0.03}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─── Main Scene Content ─── */
function SceneContent() {
  return (
    <>
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.4} color="#fff5e6" />
      <directionalLight position={[-5, 5, -3]} intensity={0.2} color="#ff8a00" />
      <pointLight position={[0, 0, 0]} intensity={0.6} color="#ff6b00" distance={15} decay={2} />

      {/* Network visualization */}
      <FloatingNodes />

      {/* Ground fog */}
      <FogPlane />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      {/* Performance adapters */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

/* ─── Exported component with Canvas wrapper ─── */
export function HeroScene3D() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
  }, [])

  if (reducedMotion) {
    // Fallback: simple gradient instead of WebGL
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
        }}
      />
    )
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
