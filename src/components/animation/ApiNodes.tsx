"use client"

import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"

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
  type: "blue" | "green" | "coral"
  emissiveColor: string
  emissiveIntensity: number
}

export function ApiNodes({ onComplete }: ApiNodesProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const hasStartedRef = useRef(false)

  // Generate 100 building nodes on a 10x10 grid
  const nodesData: NodeData[] = useMemo(() => {
    const nodes: NodeData[] = []
    const gridSize = 10
    const spacing = 1.8
    const offset = (gridSize * spacing) / 2 - spacing / 2

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const height = 0.8 + Math.random() * 3.7
        const rand = Math.random()

        let type: "blue" | "green" | "coral" = "blue"
        let emissiveColor = "#3B82F6"
        let emissiveIntensity = 2.5

        if (rand > 0.9) {
          type = "coral"
          emissiveColor = "#EF4444"
          emissiveIntensity = 3.5
        } else if (rand > 0.6) {
          type = "green"
          emissiveColor = "#10B981"
          emissiveIntensity = 3.0
        }

        nodes.push({
          id: `node-${row}-${col}`,
          x: col * spacing - offset + (Math.random() - 0.5) * 0.3,
          z: row * spacing - offset + (Math.random() - 0.5) * 0.3,
          width: 0.9 + Math.random() * 0.4,
          depth: 0.9 + Math.random() * 0.4,
          height,
          type,
          emissiveColor,
          emissiveIntensity,
        })
      }
    }
    return nodes
  }, [])

  // GSAP staggered growth from center
  useEffect(() => {
    const group = groupRef.current
    if (!group || hasStartedRef.current) return
    hasStartedRef.current = true

    // Set all children scale.y = 0 initially
    const meshChildren = group.children
    meshChildren.forEach((child) => {
      child.scale.y = 0.001
    })

    // Build GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete()
      },
    })

    timelineRef.current = tl

    // Stagger scale.y from 0 to 1, center-out, with expo easing
    tl.to(
      meshChildren.map((c) => c.scale),
      {
        y: 1,
        duration: 2.0,
        stagger: {
          amount: 2.2,
          grid: [10, 10],
          from: "center",
        },
        ease: "expo.out",
      }
    )

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [onComplete])

  return (
    <group ref={groupRef}>
      {nodesData.map((node) => {
        // CRITICAL: translate geometry so Y-scale happens from bottom face
        const bodyGeo = new THREE.BoxGeometry(node.width, node.height, node.depth)
        bodyGeo.translate(0, node.height / 2, 0)

        // Top emissive cap
        const capGeo = new THREE.BoxGeometry(node.width + 0.02, 0.06, node.depth + 0.02)
        capGeo.translate(0, node.height + 0.03, 0)

        return (
          <group key={node.id} position={[node.x, 0, node.z]}>
            {/* Dark building body */}
            <mesh geometry={bodyGeo} castShadow receiveShadow>
              <meshStandardMaterial
                color="#161B22"
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>

            {/* Glowing neon top cap */}
            <mesh geometry={capGeo}>
              <meshStandardMaterial
                color={node.emissiveColor}
                emissive={node.emissiveColor}
                emissiveIntensity={node.emissiveIntensity}
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
