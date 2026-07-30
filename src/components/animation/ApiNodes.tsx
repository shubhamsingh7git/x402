"use client"

import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"
import gsap from "gsap"

/**
 * Building nodes only. Grow from center, hold, collapse, then signal done.
 * Smooth GSAP easing throughout.
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
        duration: 2.2,
        stagger: { amount: 2.0, grid: [10, 10], from: "center" },
        ease: "power2.out",
      }
    )

    // Hold
    tl.to({}, { duration: 0.8 })

    // Phase 2: Smooth collapse from edges
    tl.to(
      meshChildren.map((c) => c.scale),
      {
        y: 0.001,
        duration: 1.4,
        stagger: { amount: 1.2, grid: [10, 10], from: "edges" },
        ease: "power2.in",
      }
    )

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <group ref={groupRef}>
      {nodesData.map((node) => {
        const bodyGeo = new THREE.BoxGeometry(node.width, node.height, node.depth)
        bodyGeo.translate(0, node.height / 2, 0)
        const capGeo = new THREE.BoxGeometry(node.width + 0.02, 0.06, node.depth + 0.02)
        capGeo.translate(0, node.height + 0.03, 0)

        return (
          <group key={node.id} position={[node.x, 0, node.z]}>
            <mesh geometry={bodyGeo} castShadow receiveShadow>
              <meshStandardMaterial color="#161B22" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh geometry={capGeo}>
              <meshStandardMaterial
                color={node.emissiveColor} emissive={node.emissiveColor}
                emissiveIntensity={node.emissiveIntensity} roughness={0.2} metalness={0.5}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
