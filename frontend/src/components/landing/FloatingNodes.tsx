"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const NODE_COUNT_DESKTOP = 50
const NODE_COUNT_MOBILE = 25
const EDGE_DISTANCE = 3.5
const SPREAD = 12

interface NodeData {
  position: THREE.Vector3
  velocity: THREE.Vector3
  phase: number
  baseY: number
}

export function FloatingNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const { viewport } = useThree()

  const isMobile = viewport.width < 8
  const count = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP

  // Generate node data
  const nodes = useMemo<NodeData[]>(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD,
        (Math.random() - 0.5) * SPREAD * 0.6,
        (Math.random() - 0.5) * SPREAD * 0.8
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.002
      ),
      phase: Math.random() * Math.PI * 2,
      baseY: (Math.random() - 0.5) * SPREAD * 0.6,
    }))
  }, [count])

  // Pre-allocate matrices and temp objects
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Edge geometry buffer
  const maxEdges = (count * (count - 1)) / 2
  const edgePositions = useMemo(() => new Float32Array(maxEdges * 6), [maxEdges])
  const edgeColors = useMemo(() => new Float32Array(maxEdges * 6), [maxEdges])

  // Create geometry and material for edges
  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3))
    geo.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [edgePositions, edgeColors])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const clampedDelta = Math.min(delta, 0.05)

    // Update node positions
    for (let i = 0; i < count; i++) {
      const node = nodes[i]

      // Gentle floating motion
      node.position.x += node.velocity.x + Math.sin(time * 0.3 + node.phase) * 0.001
      node.position.y =
        node.baseY +
        Math.sin(time * 0.5 + node.phase) * 0.8 +
        Math.cos(time * 0.3 + node.phase * 2) * 0.3
      node.position.z += node.velocity.z + Math.cos(time * 0.2 + node.phase) * 0.001

      // Soft boundary wrapping
      if (Math.abs(node.position.x) > SPREAD * 0.6) node.velocity.x *= -1
      if (Math.abs(node.position.z) > SPREAD * 0.5) node.velocity.z *= -1

      // Slight rotation for life
      const scale = 0.08 + Math.sin(time * 2 + node.phase) * 0.02
      dummy.position.copy(node.position)
      dummy.rotation.set(
        time * 0.3 + node.phase,
        time * 0.5 + node.phase * 2,
        time * 0.2 + node.phase * 0.5
      )
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Color: warm orange with brightness pulsing
      const brightness = 0.6 + Math.sin(time * 1.5 + node.phase) * 0.2
      tempColor.setHSL(0.08, 0.8, brightness)
      meshRef.current.setColorAt(i, tempColor)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true

    // Update edges
    if (edgesRef.current) {
      let edgeIndex = 0
      const posAttr = edgeGeometry.getAttribute("position") as THREE.BufferAttribute
      const colAttr = edgeGeometry.getAttribute("color") as THREE.BufferAttribute

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const distSq = nodes[i].position.distanceToSquared(nodes[j].position)
          if (distSq < EDGE_DISTANCE * EDGE_DISTANCE) {
            const dist = Math.sqrt(distSq)
            const alpha = 1 - dist / EDGE_DISTANCE
            const idx = edgeIndex * 6

            posAttr.array[idx] = nodes[i].position.x
            posAttr.array[idx + 1] = nodes[i].position.y
            posAttr.array[idx + 2] = nodes[i].position.z
            posAttr.array[idx + 3] = nodes[j].position.x
            posAttr.array[idx + 4] = nodes[j].position.y
            posAttr.array[idx + 5] = nodes[j].position.z

            // Orange-tinted edge color
            const r = 1.0 * alpha
            const g = 0.55 * alpha
            const b = 0.1 * alpha
            colAttr.array[idx] = r
            colAttr.array[idx + 1] = g
            colAttr.array[idx + 2] = b
            colAttr.array[idx + 3] = r
            colAttr.array[idx + 4] = g
            colAttr.array[idx + 5] = b

            edgeIndex++
          }
        }
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
      edgeGeometry.setDrawRange(0, edgeIndex * 2)
    }
  })

  return (
    <group>
      {/* Instanced nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#ff8a00"
          emissive="#ff6b00"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* Edges */}
      <lineSegments ref={edgesRef} geometry={edgeGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Ambient dust particles */}
      <DustParticles count={isMobile ? 100 : 300} />
    </group>
  )
}

/* ─── Floating dust particles ─── */
function DustParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD * 1.5
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD
      ph[i] = Math.random() * Math.PI * 2
    }
    return [pos, ph]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      posAttr.array[idx + 1] += Math.sin(time * 0.3 + phases[i]) * 0.002
      posAttr.array[idx] += Math.cos(time * 0.2 + phases[i]) * 0.001
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff8a00"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
