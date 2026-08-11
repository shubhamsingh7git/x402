"use client"

import { useRef, useMemo, useEffect, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Line, Float } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { useTheme } from "next-themes"

/* ═══════════ AGENT DATA ═══════════ */
const AGENTS = [
  { label: "RESEARCH",  color: "#A855F7", angle: 0,     elev: 1.2 },
  { label: "CONTENT",   color: "#22D3EE", angle: 51.4,  elev: -0.6 },
  { label: "DATA",      color: "#60A5FA", angle: 102.8, elev: 0.8 },
  { label: "SUPPORT",   color: "#F472B6", angle: 154.3, elev: -1.0 },
  { label: "AUTOMATE",  color: "#34D399", angle: 205.7, elev: 0.4 },
  { label: "LEARNING",  color: "#818CF8", angle: 257.1, elev: -0.4 },
  { label: "DECISION",  color: "#FBBF24", angle: 308.6, elev: 1.0 },
]

const R = 5.5
const D2R = Math.PI / 180

/* ═══════════ SPRITE TEXT (canvas-based, no font file needed) ═══════════ */
function Label({ text, pos, color = "#fff", size = 0.3 }: {
  text: string; pos: [number, number, number]; color?: string; size?: number
}) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = 512; c.height = 64
    const ctx = c.getContext("2d")!
    ctx.font = "bold 40px Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = color
    ctx.fillText(text, 256, 32)
    const t = new THREE.CanvasTexture(c)
    t.needsUpdate = true
    return t
  }, [text, color])

  useEffect(() => {
    return () => {
      tex.dispose()
    }
  }, [tex])

  return (
    <sprite position={pos} scale={[size * 6, size * 0.75, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  )
}

/* ═══════════ PROCESSOR CHIP ═══════════ */
function Chip() {
  const ref = useRef<THREE.Group>(null!)
  const glow = useRef<THREE.PointLight>(null!)

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const sz = 1.0, c = 0.38
    s.moveTo(-sz + c, -sz); s.lineTo(sz - c, -sz); s.lineTo(sz, -sz + c)
    s.lineTo(sz, sz - c); s.lineTo(sz - c, sz); s.lineTo(-sz + c, sz)
    s.lineTo(-sz, sz - c); s.lineTo(-sz, -sz + c); s.closePath()
    return s
  }, [])

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.set(0.001, 0.001, 0.001)
    gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(1.4)", delay: 0.1 })
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (glow.current) glow.current.intensity = 3 + Math.sin(t * 2) * 1.5
    if (ref.current) ref.current.rotation.y += 0.002
  })

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[shape, { depth: 0.25, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 }]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[shape, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
        <extrudeGeometry args={[shape, { depth: 0.26, bevelEnabled: false }]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.5} />
      </mesh>
      <pointLight ref={glow} position={[0, 0.5, 0]} color="#06b6d4" intensity={3} distance={8} />
      {/* Pin traces */}
      {[0, 90, 180, 270].map((rot) => (
        <group key={rot} rotation={[0, rot * D2R, 0]}>
          {[-0.6, -0.3, 0, 0.3, 0.6].map((off, i) => (
            <mesh key={i} position={[1.15, 0.06, off]}>
              <boxGeometry args={[0.3, 0.04, 0.06]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <Label text="AI" pos={[0, 0.5, 0]} color="#22d3ee" size={0.6} />
      <Label text="PROCESSOR" pos={[0, -0.15, 0]} color="#0e7490" size={0.25} />
    </group>
  )
}

/* ═══════════ AGENT ORB ═══════════ */
function Orb({ agent, i }: { agent: typeof AGENTS[0]; i: number }) {
  const ref = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.PointLight>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const base = useMemo(() => {
    const rad = agent.angle * D2R
    return new THREE.Vector3(Math.cos(rad) * R, agent.elev, Math.sin(rad) * R)
  }, [agent])

  useEffect(() => {
    if (!ref.current) return
    ref.current.position.set(0, 0, 0)
    ref.current.scale.set(0.001, 0.001, 0.001)
    gsap.to(ref.current.position, {
      x: base.x, y: base.y, z: base.z,
      duration: 1.6, delay: 0.3 + i * 0.1, ease: "power2.out",
    })
    gsap.to(ref.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.0, delay: 0.3 + i * 0.1, ease: "back.out(1.5)",
    })
  }, [base, i])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) ref.current.position.y = base.y + Math.sin(t * 0.7 + i) * 0.15
    if (glowRef.current) glowRef.current.intensity = 2 + Math.sin(t * 1.2 + i * 0.5) * 1
    if (meshRef.current) { meshRef.current.rotation.y += 0.008; meshRef.current.rotation.x += 0.004 }
  })

  return (
    <group ref={ref}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.45, 2]} />
          <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={2} toneMapped={false} wireframe metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#0a0f1a" emissive={agent.color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      <Label text={agent.label} pos={[0, -0.8, 0]} color={agent.color} size={0.2} />
      <pointLight ref={glowRef} color={agent.color} intensity={2} distance={4} />
    </group>
  )
}

/* ═══════════ CONNECTION BEAM ═══════════ */
function Beam({ agent, i }: { agent: typeof AGENTS[0]; i: number }) {
  const dotRef = useRef<THREE.Mesh>(null!)
  const [vis, setVis] = useState(false)

  const end = useMemo(() => {
    const rad = agent.angle * D2R
    return new THREE.Vector3(Math.cos(rad) * R, agent.elev, Math.sin(rad) * R)
  }, [agent])

  const { curve, pts } = useMemo(() => {
    const mid = new THREE.Vector3(end.x * 0.5, end.y * 0.5 + 0.8, end.z * 0.5)
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.1, 0), mid, end])
    return { curve: c, pts: c.getPoints(50) }
  }, [end])

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 600 + i * 100)
    return () => clearTimeout(t)
  }, [i])

  useFrame(({ clock }) => {
    if (!dotRef.current || !vis) return
    const t = clock.getElapsedTime()
    const p = Math.sin(t * 0.5 + i * 0.9) * 0.5 + 0.5
    dotRef.current.position.copy(curve.getPointAt(p))
  })

  if (!vis) return null

  return (
    <group>
      <Line points={pts} color={agent.color} lineWidth={1.5} transparent opacity={0.3} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ═══════════ PARTICLES ═══════════ */
function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const count = 200
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24
      vel.push(new THREE.Vector3((Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004))
    }
    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i].x; arr[i * 3 + 1] += velocities[i].y; arr[i * 3 + 2] += velocities[i].z
      if (Math.abs(arr[i * 3]) > 12) arr[i * 3] *= -0.95
      if (Math.abs(arr[i * 3 + 1]) > 7) arr[i * 3 + 1] *= -0.95
      if (Math.abs(arr[i * 3 + 2]) > 12) arr[i * 3 + 2] *= -0.95
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color={isDark ? "#06b6d4" : "#d35400"} 
        transparent 
        opacity={isDark ? 0.35 : 0.6} 
        sizeAttenuation 
        depthWrite={false} 
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
      />
    </points>
  )
}

/* ═══════════ ORBITAL CAMERA ═══════════ */
function OrbitalCam() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 14, 14)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const a = t * 0.12
    camera.position.x = Math.cos(a) * 12
    camera.position.z = Math.sin(a) * 12
    camera.position.y = 5.5 + Math.sin(t * 0.2) * 0.8
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ═══════════ TITLE BILLBOARD ═══════════ */
function Title() {
  const ref = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.set(0.001, 0.001, 0.001)
    gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1.0, delay: 0.2, ease: "power2.out" })
  }, [])

  useFrame(() => { if (ref.current) ref.current.quaternion.copy(camera.quaternion) })

  return (
    <group ref={ref} position={[0, 5.5, 0]}>
      <Label text="AI AGENT NETWORK" pos={[0, 0, 0]} color={isDark ? "#ffffff" : "#2d2a26"} size={0.5} />
      <Label text="CONNECTED · INTELLIGENT · AUTONOMOUS" pos={[0, -0.55, 0]} color={isDark ? "#475569" : "#6b6560"} size={0.16} />
    </group>
  )
}

/* ═══════════ EXPORTED OVERLAY ═══════════ */
interface AgentNetworkOverlayProps {
  onComplete: () => void
}

export function AgentNetworkOverlay({ onComplete }: AgentNetworkOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const bgColor = isDark ? "#060a12" : "#FAF7EE"

  useEffect(() => {
    // Fade in
    if (containerRef.current) {
      containerRef.current.style.opacity = "0"
      gsap.to(containerRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" })
    }

    // Hold for 0.6s, then fade out and complete
    const timer = setTimeout(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete,
        })
      } else {
        onComplete()
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50"
      style={{ background: bgColor, opacity: 0 }}
    >
      <Canvas
        camera={{ position: [0, 14, 14], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 18, 35]} />

        <OrbitalCam />

        <ambientLight intensity={isDark ? 0.2 : 0.6} color={isDark ? "#1e293b" : "#ffffff"} />
        <directionalLight position={[10, 15, 10]} intensity={isDark ? 0.6 : 1.2} color={isDark ? "#94a3b8" : "#2d2a26"} />

        <Chip />
        {AGENTS.map((a, i) => <Orb key={a.label} agent={a} i={i} />)}
        {AGENTS.map((a, i) => <Beam key={`b-${a.label}`} agent={a} i={i} />)}
        <Title />
        <Particles />
        <gridHelper args={[30, 30, isDark ? "#0e2a3a" : "#cbd5e1", isDark ? "#0a1520" : "#f1f5f9"]} position={[0, -2.5, 0]} />
      </Canvas>

      {/* HUD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 tracking-wider font-semibold uppercase">
          Network Online · All Agents Connected
        </span>
      </div>
    </div>
  )
}
