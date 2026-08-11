"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  tx: number // target x
  ty: number // target y
  ox: number // origin x
  oy: number // origin y
  vx: number
  vy: number
  size: number
  alpha: number
  spriteIndex: number // replaces hue for the sprite sheet
  phase: number // random offset for floating
}

interface CinematicLoginSceneProps {
  onSceneComplete: () => void
  reducedMotion?: boolean
}

export function CinematicLoginScene({ onSceneComplete, reducedMotion = false }: CinematicLoginSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const stageRef = useRef<"emerging" | "assembling" | "orbiting" | "dissolving" | "done">("emerging")
  const stageTimeRef = useRef(0)

  // Skip animation if reduced motion
  useEffect(() => {
    if (reducedMotion) {
      onSceneComplete()
    }
  }, [reducedMotion, onSceneComplete])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })!
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = `${window.innerWidth}px`
      canvas!.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // ─── Generate logo points AFTER fonts are ready ───
    async function initAnimation() {
      // Wait for all fonts to load so Inter is available for canvas rendering
      await document.fonts.ready

      const CW = 800
      const CH = 220
      const offscreen = document.createElement("canvas")
      offscreen.width = CW
      offscreen.height = CH
      const offCtx = offscreen.getContext("2d")!
      offCtx.clearRect(0, 0, CW, CH)
      offCtx.fillStyle = "#ffffff"
      // Use a font size with generous vertical padding
      offCtx.font = `bold 140px Inter, ui-sans-serif, system-ui, sans-serif`
      offCtx.textAlign = "center"
      offCtx.textBaseline = "middle"
      offCtx.fillText("x402", CW / 2, CH / 2)

      const imageData = offCtx.getImageData(0, 0, CW, CH)
      const rawPoints: { x: number; y: number }[] = []
      const step = 3 // sample every 3px for denser coverage
      for (let y = 0; y < CH; y += step) {
        for (let x = 0; x < CW; x += step) {
          const i = (y * CW + x) * 4
          if (imageData.data[i + 3] > 80) {
            rawPoints.push({ x: x / CW, y: y / CH })
          }
        }
      }

      if (rawPoints.length === 0) {
        // Fallback: skip animation entirely if canvas failed
        onSceneComplete()
        return
      }

      const w = window.innerWidth
      const h = window.innerHeight

      // Logo positioning: center of screen, spanning ~45% of screen width
      // CW:CH = 800:220 ≈ 3.636:1 aspect ratio
      const logoW = Math.min(w * 0.48, 600)
      const logoH = logoW * (CH / CW)
      const logoX = (w - logoW) / 2
      const logoY = (h - logoH) / 2

      // Build particle array — use ALL sampled points for full coverage
      const particleCount = Math.min(rawPoints.length, 500)
      // Shuffle points for even distribution
      const shuffled = [...rawPoints].sort(() => Math.random() - 0.5)
      const selectedPoints = shuffled.slice(0, particleCount)

      // ─── Pre-render Particle Sprite Sheet ───
      const spriteSize = 40
      const spriteCanvas = document.createElement("canvas")
      spriteCanvas.width = spriteSize * 3
      spriteCanvas.height = spriteSize
      const sCtx = spriteCanvas.getContext("2d")!
      
      const hues = [25, 35, 45] // orange, warm amber, gold
      hues.forEach((h, idx) => {
        const cx = idx * spriteSize + spriteSize / 2
        const cy = spriteSize / 2
        
        // Outer glow
        const grd = sCtx.createRadialGradient(cx, cy, 0, cx, cy, spriteSize / 2)
        grd.addColorStop(0, `hsla(${h}, 90%, 65%, 0.7)`)
        grd.addColorStop(0.3, `hsla(${h}, 80%, 55%, 0.3)`)
        grd.addColorStop(1, `hsla(${h}, 80%, 50%, 0)`)
        sCtx.fillStyle = grd
        sCtx.beginPath()
        sCtx.arc(cx, cy, spriteSize / 2, 0, Math.PI * 2)
        sCtx.fill()

        // Core dot
        sCtx.fillStyle = `hsla(${h}, 95%, 80%, 1)`
        sCtx.beginPath()
        sCtx.arc(cx, cy, spriteSize * 0.1, 0, Math.PI * 2)
        sCtx.fill()
      })

      const particles: Particle[] = selectedPoints.map((lp) => {
        const edge = Math.random()
        let ox: number, oy: number
        if (edge < 0.25) { ox = -20; oy = Math.random() * h }
        else if (edge < 0.5) { ox = w + 20; oy = Math.random() * h }
        else if (edge < 0.75) { ox = Math.random() * w; oy = -20 }
        else { ox = Math.random() * w; oy = h + 20 }

        return {
          x: ox, y: oy,
          tx: logoX + lp.x * logoW,
          ty: logoY + lp.y * logoH,
          ox, oy,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0,
          spriteIndex: Math.floor(Math.random() * 3),
          phase: Math.random() * Math.PI * 2,
        }
      })

      let startTime = performance.now()
      let lastTime = startTime
      stageRef.current = "emerging"
      stageTimeRef.current = 0

      // Stage timings (in seconds)
      const EMERGE_DUR = 1.8
      const ASSEMBLE_DUR = 2.8
      const ORBIT_DUR = 2.0
      const DISSOLVE_DUR = 1.0

      function animate(now: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.05)
        lastTime = now
        const elapsed = (now - startTime) / 1000
        stageTimeRef.current += dt

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)

        const stage = stageRef.current
        const st = stageTimeRef.current

        // Stage transitions
        if (stage === "emerging" && st > EMERGE_DUR) {
          stageRef.current = "assembling"
          stageTimeRef.current = 0
        } else if (stage === "assembling" && st > ASSEMBLE_DUR) {
          stageRef.current = "orbiting"
          stageTimeRef.current = 0
        } else if (stage === "orbiting" && st > ORBIT_DUR) {
          stageRef.current = "dissolving"
          stageTimeRef.current = 0
        } else if (stage === "dissolving" && st > DISSOLVE_DUR) {
          stageRef.current = "done"
          onSceneComplete()
          return
        }

        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const cx = w / 2
        const cy = h / 2

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]

          if (stage === "emerging") {
            const progress = Math.min(st / EMERGE_DUR, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            p.alpha = ease * 0.75
            // Float toward center area
            const midX = cx + (Math.random() - 0.5) * w * 0.5
            const midY = cy + (Math.random() - 0.5) * h * 0.5
            p.x += (midX - p.x) * 0.007 + p.vx * 0.5 + Math.sin(elapsed * 0.5 + p.phase) * 0.4
            p.y += (midY - p.y) * 0.007 + p.vy * 0.5 + Math.cos(elapsed * 0.5 + p.phase) * 0.4
            // Mouse repulsion
            const dxm = p.x - mx * w
            const dym = p.y - my * h
            const distM = Math.sqrt(dxm * dxm + dym * dym)
            if (distM < 120 && distM > 0) {
              p.x += (dxm / distM) * 2.5
              p.y += (dym / distM) * 2.5
            }
          } else if (stage === "assembling") {
            const progress = Math.min(st / ASSEMBLE_DUR, 1)
            const ease = 1 - Math.pow(1 - progress, 4)
            p.x += (p.tx - p.x) * (0.025 + ease * 0.07)
            p.y += (p.ty - p.y) * (0.025 + ease * 0.07)
            p.alpha = 0.5 + ease * 0.5
            // Gentle float that fades out as they lock in
            p.x += Math.sin(elapsed * 2 + p.phase) * (1 - ease) * 0.4
            p.y += Math.cos(elapsed * 2 + p.phase) * (1 - ease) * 0.4
          } else if (stage === "orbiting") {
            const progress = Math.min(st / ORBIT_DUR, 1)
            const angle = elapsed * 0.25 + (i / particles.length) * Math.PI * 2
            const orbitR = 2 + Math.sin(elapsed * 1.5 + p.phase) * 1.5
            p.x = p.tx + Math.cos(angle) * orbitR
            p.y = p.ty + Math.sin(angle) * orbitR * 0.5
            p.alpha = 1.0 - progress * 0.15
            p.size = (1.2 + Math.random() * 1.8) * (1 + Math.sin(elapsed * 3 + p.phase) * 0.15)
          } else if (stage === "dissolving") {
            const progress = Math.min(st / DISSOLVE_DUR, 1)
            const ease = progress * progress
            p.x += (cx - p.x) * (0.04 + ease * 0.1)
            p.y += (cy - p.y) * (0.04 + ease * 0.1)
            p.alpha = 1.0 - ease
            p.size *= 0.995
          }
        }

        // Draw connections during assembling and orbiting
        if (stage === "assembling" || stage === "orbiting") {
          const connectionDist = 40
          const connectionDistSq = connectionDist * connectionDist
          ctx.lineWidth = 0.4
          for (let i = 0; i < particles.length; i += 2) {
            let connections = 0
            for (let j = i + 1; j < particles.length && connections < 4; j++) {
              const dx = particles[i].x - particles[j].x
              const dy = particles[i].y - particles[j].y
              if (Math.abs(dx) > connectionDist || Math.abs(dy) > connectionDist) continue
              
              const distSq = dx * dx + dy * dy
              if (distSq < connectionDistSq) {
                const dist = Math.sqrt(distSq)
                const alpha = (1 - dist / connectionDist) * 0.25 * Math.min(particles[i].alpha, particles[j].alpha)
                ctx.strokeStyle = `hsla(30, 80%, 60%, ${alpha})`
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
                connections++
              }
            }
          }
        }

        // Draw particles using pre-rendered sprites
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (p.alpha <= 0.01) continue

          ctx.globalAlpha = p.alpha
          // Scale sprite based on particle size (1.2-3.0 base size maps to 12-30px sprite)
          const drawSize = p.size * 10
          ctx.drawImage(
            spriteCanvas,
            p.spriteIndex * spriteSize, 0, spriteSize, spriteSize,
            p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize
          )
        }
        ctx.globalAlpha = 1.0 // Reset alpha

        // Central glow during orbiting/dissolving
        if (stage === "orbiting" || stage === "dissolving") {
          const progress = stage === "dissolving" ? Math.min(st / DISSOLVE_DUR, 1) : 0
          const glowSize = stage === "dissolving" ? 80 + progress * 250 : 50 + Math.sin(elapsed * 2) * 15
          const glowAlpha = stage === "dissolving" ? 0.35 * (1 - progress) : 0.12
          const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize)
          grd.addColorStop(0, `hsla(30, 80%, 60%, ${glowAlpha})`)
          grd.addColorStop(1, "hsla(30, 80%, 55%, 0)")
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(cx, cy, glowSize, 0, Math.PI * 2)
          ctx.fill()
        }

        animRef.current = requestAnimationFrame(animate)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    initAnimation()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [reducedMotion, onSceneComplete, handleMouseMove])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  )
}
