import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { useTheme } from "next-themes"

/**
 * Building nodes only. Grow from center, hold, collapse, then signal done.
 * Smooth GSAP easing throughout with full dark/white theme support.
 */
interface ApiNodesProps {
  onComplete?: () => void
}

interface NodeData {
  id: string
  x: number
  z: number
  width: number
  depth: number
  height: number
  emissiveColor: string
  emissiveIntensity: number
}

export function ApiNodes({ onComplete }: ApiNodesProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const groupRef = useRef<THREE.Group>(null!)
  const hasStartedRef = useRef(false)

  const nodesData: NodeData[] = useMemo(() => {
    const nodes: NodeData[] = []
    const gridSize = 10
    const spacing = 1.8
    const offset = (gridSize * spacing) / 2 - spacing / 2

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const height = 0.8 + Math.random() * 3.7
        const rand = Math.random()
        let emissiveColor = "#3B82F6"
        let emissiveIntensity = 2.5
        if (rand > 0.9) { emissiveColor = "#EF4444"; emissiveIntensity = 3.5 }
        else if (rand > 0.6) { emissiveColor = "#10B981"; emissiveIntensity = 3.0 }

        nodes.push({
          id: `node-${row}-${col}`,
          x: col * spacing - offset + (Math.random() - 0.5) * 0.3,
          z: row * spacing - offset + (Math.random() - 0.5) * 0.3,
          width: 0.9 + Math.random() * 0.4,
          depth: 0.9 + Math.random() * 0.4,
          height, emissiveColor, emissiveIntensity,
        })
      }
    }
    return nodes
  }, [])

  const geometries = useMemo(() => {
    return nodesData.map((node) => {
      const bodyGeo = new THREE.BoxGeometry(node.width, node.height, node.depth)
      bodyGeo.translate(0, node.height / 2, 0)
      const capGeo = new THREE.BoxGeometry(node.width + 0.02, 0.06, node.depth + 0.02)
      capGeo.translate(0, node.height + 0.03, 0)
      return { bodyGeo, capGeo }
    })
  }, [nodesData])

  useEffect(() => {
    return () => {
      geometries.forEach(({ bodyGeo, capGeo }) => {
        bodyGeo.dispose()
        capGeo.dispose()
      })
    }
  }, [geometries])

  useEffect(() => {
    const group = groupRef.current
    if (!group || hasStartedRef.current) return
    hasStartedRef.current = true

    const meshChildren = group.children
    meshChildren.forEach((c) => { c.scale.y = 0.001 })

    const tl = gsap.timeline({
      onComplete: () => { if (onComplete) onComplete() },
    })

    // Phase 1: Smooth growth from center
    tl.to(
      meshChildren.map((c) => c.scale),
      {
        y: 1,
        duration: 0.45,
        stagger: { amount: 0.22, grid: [10, 10], from: "center" },
        ease: "power2.out",
      }
    )

    // Hold
    tl.to({}, { duration: 0.08 })

    // Phase 2: Smooth collapse from edges
    tl.to(
      meshChildren.map((c) => c.scale),
      {
        y: 0.001,
        duration: 0.35,
        stagger: { amount: 0.18, grid: [10, 10], from: "edges" },
        ease: "power2.in",
      }
    )

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <group ref={groupRef}>
      {nodesData.map((node, index) => {
        const { bodyGeo, capGeo } = geometries[index]

        return (
          <group key={node.id} position={[node.x, 0, node.z]}>
            <mesh geometry={bodyGeo} castShadow receiveShadow>
              <meshStandardMaterial
                color={isDark ? "#161B22" : "#e2e8f0"}
                roughness={isDark ? 0.3 : 0.15}
                metalness={isDark ? 0.8 : 0.2}
              />
            </mesh>
            <mesh geometry={capGeo}>
              <meshStandardMaterial
                color={node.emissiveColor}
                emissive={node.emissiveColor}
                emissiveIntensity={isDark ? node.emissiveIntensity : node.emissiveIntensity * 0.8}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
