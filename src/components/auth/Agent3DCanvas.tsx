"use client"

import { useEffect, useRef } from "react"

interface Node3D {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  radius: number
  color: string
  label: string
}

export function Agent3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }

    window.addEventListener("resize", handleResize)

    // Generate agentic nodes
    const nodeLabels = [
      "CDP Wallet Node",
      "Policy Guard",
      "Legal Sandbox API",
      "x402 Facilitator",
      "LLM Synthesizer",
      "Deceptive DB",
      "Audit Engine",
      "Treasury Manager",
    ]

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"]

    const nodes: Node3D[] = nodeLabels.map((label, i) => {
      const theta = (i / nodeLabels.length) * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      const r = 180
      return {
        x: r * Math.cos(theta) * Math.cos(phi),
        y: r * Math.sin(phi),
        z: r * Math.sin(theta) * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        radius: 6,
        color: colors[i % colors.length],
        label,
      }
    })

    let angleY = 0
    let angleX = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      angleY += 0.006
      angleX += 0.003

      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)

      const projected: { x: number; y: number; z: number; node: Node3D }[] = []

      nodes.forEach((node) => {
        // Rotate around Y and X
        let x1 = node.x * cosY - node.z * sinY
        let z1 = node.z * cosY + node.x * sinY

        let y1 = node.y * cosX - z1 * sinX
        let z2 = z1 * cosX + node.y * sinX

        // Perspective projection
        const fov = 400
        const scale = fov / (fov + z2)
        const x2 = cx + x1 * scale
        const y2 = cy + y1 * scale

        projected.push({ x: x2, y: y2, z: z2, node })
      })

      // Draw connection lines between nearby nodes
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i]
          const p2 = projected[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.4
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.lineWidth = 1.2
            ctx.stroke()
          }
        }
      }

      // Sort by depth for correct ordering
      projected.sort((a, b) => b.z - a.z)

      // Render nodes & glowing aura
      projected.forEach(({ x, y, z, node }) => {
        const fov = 400
        const scale = fov / (fov + z)
        const size = Math.max(3, node.radius * scale)
        const alpha = Math.max(0.3, Math.min(1, (z + 200) / 400))

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Inner solid core
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // Label
        ctx.font = `${Math.max(10, 11 * scale)}px sans-serif`
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
        ctx.fillText(node.label, x + size + 8, y + 4)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[350px] flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
