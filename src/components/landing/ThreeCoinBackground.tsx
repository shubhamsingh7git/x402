"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function ThreeCoinBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [interactiveMsg, setInteractiveMsg] = useState<string | null>(
    "Drag / Scroll to rotate 3D x402 coin · Click for shockwave · Double click to supercharge"
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const mainGoldLight = new THREE.DirectionalLight(0xffd700, 2.8)
    mainGoldLight.position.set(3, 4, 5)
    scene.add(mainGoldLight)

    const blueRimLight = new THREE.DirectionalLight(0x3b82f6, 2.0)
    blueRimLight.position.set(-4, -2, 3)
    scene.add(blueRimLight)

    const cursorPointLight = new THREE.PointLight(0xffb700, 3.5, 9)
    scene.add(cursorPointLight)

    // 1. Procedural 3D Golden Coin Assembly Group
    const coinGroup = new THREE.Group()
    coinGroup.position.set(1.4, 1.2, 0) // Positioned near upper-right hand

    // Main Coin Body Cylinder
    const coinGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.14, 64)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.92,
      roughness: 0.2,
    })
    const coinMesh = new THREE.Mesh(coinGeo, goldMat)
    coinMesh.rotation.x = Math.PI / 2
    coinGroup.add(coinMesh)

    // Outer Rim Bevel
    const rimGeo = new THREE.TorusGeometry(0.86, 0.04, 16, 64)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      metalness: 0.95,
      roughness: 0.15,
    })
    const rimMesh = new THREE.Mesh(rimGeo, rimMat)
    coinGroup.add(rimMesh)

    // Inset Rings
    const innerRingGeo = new THREE.TorusGeometry(0.68, 0.02, 16, 64)
    const innerRingFront = new THREE.Mesh(innerRingGeo, rimMat)
    innerRingFront.position.z = 0.075
    coinGroup.add(innerRingFront)

    const innerRingBack = new THREE.Mesh(innerRingGeo, rimMat)
    innerRingBack.position.z = -0.075
    coinGroup.add(innerRingBack)

    // ── Create 3D x402 Guard Octagon Shield Logo Mesh ──
    const createOctagonLogoMesh = () => {
      const shape = new THREE.Shape()
      // Octagon points scaled around (0,0)
      const points: [number, number][] = [
        [0, 0.42],
        [0.28, 0.28],
        [0.42, 0],
        [0.28, -0.28],
        [0, -0.42],
        [-0.28, -0.28],
        [-0.42, 0],
        [-0.28, 0.28],
      ]
      shape.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i][0], points[i][1])
      }
      shape.closePath()

      const extrudeSettings = {
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      }

      const logoGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const logoMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.5,
      })
      const mesh = new THREE.Mesh(logoGeo, logoMat)
      mesh.geometry.center() // Center geometry
      return { mesh, logoMat }
    }

    // Front & Back 3D x402 Logos
    const { mesh: logoFront, logoMat: logoMatFront } = createOctagonLogoMesh()
    logoFront.position.z = 0.08
    coinGroup.add(logoFront)

    const { mesh: logoBack, logoMat: logoMatBack } = createOctagonLogoMesh()
    logoBack.position.z = -0.08
    logoBack.rotation.y = Math.PI
    coinGroup.add(logoBack)

    // Inner Glowing Core Sphere on Logo
    const coreGeo = new THREE.SphereGeometry(0.08, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 })

    const coreFront = new THREE.Mesh(coreGeo, coreMat)
    coreFront.position.z = 0.12
    coinGroup.add(coreFront)

    const coreBack = new THREE.Mesh(coreGeo, coreMat)
    coreBack.position.z = -0.12
    coinGroup.add(coreBack)

    scene.add(coinGroup)

    // 2. Orbit Rings
    const orbitGroup = new THREE.Group()
    orbitGroup.position.copy(coinGroup.position)

    const orbit1Geo = new THREE.TorusGeometry(1.25, 0.012, 16, 100)
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5, wireframe: true })
    const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat)
    orbitGroup.add(orbit1)

    const orbit2Geo = new THREE.TorusGeometry(1.55, 0.01, 16, 100)
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4, wireframe: true })
    const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat)
    orbit2.rotation.x = Math.PI / 3
    orbitGroup.add(orbit2)

    scene.add(orbitGroup)

    // 3. Interactive Floating Particles with Cursor Magnetic Fluid Effect
    const particleCount = 280
    const particleGeo = new THREE.BufferGeometry()
    const posArr = new Float32Array(particleCount * 3)
    const basePos = new Float32Array(particleCount * 3)
    const velocities: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = (Math.random() - 0.5) * 9
      const z = (Math.random() - 0.5) * 6

      posArr[i * 3] = basePos[i * 3] = x
      posArr[i * 3 + 1] = basePos[i * 3 + 1] = y
      posArr[i * 3 + 2] = basePos[i * 3 + 2] = z

      velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.002,
      })
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3))

    // Glowing Texture
    const pCanvas = document.createElement("canvas")
    pCanvas.width = 64
    pCanvas.height = 64
    const pCtx = pCanvas.getContext("2d")
    if (pCtx) {
      const g = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, "rgba(255, 215, 0, 1)")
      g.addColorStop(0.5, "rgba(245, 158, 11, 0.7)")
      g.addColorStop(1, "rgba(0, 0, 0, 0)")
      pCtx.fillStyle = g
      pCtx.fillRect(0, 0, 64, 64)
    }

    const pTexture = new THREE.CanvasTexture(pCanvas)
    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 4. Shockwaves Pool
    const shockwaves: { mesh: THREE.Mesh; scale: number; alpha: number }[] = []

    const triggerShockwave = (x: number, y: number, color = 0xffd700) => {
      const shockGeo = new THREE.TorusGeometry(0.1, 0.02, 16, 64)
      const shockMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
      const shockMesh = new THREE.Mesh(shockGeo, shockMat)
      shockMesh.position.set(x, y, 0.5)
      scene.add(shockMesh)
      shockwaves.push({ mesh: shockMesh, scale: 0.1, alpha: 0.9 })
    }

    // Interactive State Variables
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotVelX = 0
    let rotVelY = 0
    let flipVelocity = 0
    let superchargeTime = 0
    let scrollRotationY = 0

    const mouseVec = new THREE.Vector2()

    // ── Mouse & Drag Handlers ──
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1

      cursorPointLight.position.x = mouseVec.x * 4.5
      cursorPointLight.position.y = mouseVec.y * 3
      cursorPointLight.position.z = 2.5

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY

        rotVelY = deltaX * 0.012
        rotVelX = deltaY * 0.012

        prevMouseX = e.clientX
        prevMouseY = e.clientY
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    // ── Click Gesture (Shockwave & Coin Flip) ──
    const onClick = (e: MouseEvent) => {
      const x = mouseVec.x * 4
      const y = mouseVec.y * 2.5
      triggerShockwave(x, y, 0xffd700)
      flipVelocity = 0.35
    }

    // ── Double Click Gesture (Supercharged Burst) ──
    const onDoubleClick = (e: MouseEvent) => {
      const x = mouseVec.x * 4
      const y = mouseVec.y * 2.5
      triggerShockwave(x, y, 0x3b82f6)
      triggerShockwave(x, y, 0xffd700)

      superchargeTime = 1.6
      flipVelocity = 0.8

      setInteractiveMsg("⚡ x402 GUARD SUPERCHARGED! EIP-712 Signature Authorized!")
      setTimeout(() => {
        setInteractiveMsg("Drag / Scroll to rotate 3D x402 coin · Click for shockwave · Double click to supercharge")
      }, 3500)
    }

    // ── Scroll Driven 3D Coin Rotation ──
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      scrollRotationY = scrollY * 0.004
    }

    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("click", onClick)
    window.addEventListener("dblclick", onDoubleClick)
    window.addEventListener("scroll", onScroll)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)

    // Animation Loop
    let reqId: number
    const animate = () => {
      reqId = requestAnimationFrame(animate)

      // Apply drag rotation & scroll rotation
      coinGroup.rotation.y += rotVelY + (scrollRotationY - coinGroup.rotation.y * 0.01) * 0.05
      coinGroup.rotation.x += rotVelX

      if (!isDragging) {
        rotVelY *= 0.95
        rotVelX *= 0.95
        coinGroup.rotation.y += 0.008 // Idle rotation
      }

      if (flipVelocity > 0.01) {
        coinGroup.rotation.y += flipVelocity
        flipVelocity *= 0.92
      }

      // Supercharge Aura
      if (superchargeTime > 0) {
        superchargeTime -= 0.015
        logoMatFront.emissiveIntensity = 1.8 + Math.sin(Date.now() * 0.02) * 0.8
        logoMatBack.emissiveIntensity = 1.8 + Math.sin(Date.now() * 0.02) * 0.8
        orbit1Mat.opacity = 0.9
        orbit2Mat.opacity = 0.9
      } else {
        logoMatFront.emissiveIntensity = 0.5
        logoMatBack.emissiveIntensity = 0.5
        orbit1Mat.opacity = 0.5
        orbit2Mat.opacity = 0.4
      }

      // Rotate Orbit Rings
      orbitGroup.rotation.z += 0.012
      orbitGroup.rotation.x += 0.008

      // Shockwaves Update
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i]
        sw.scale += 0.15
        sw.alpha -= 0.025
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale)
        ;(sw.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, sw.alpha)

        if (sw.alpha <= 0) {
          scene.remove(sw.mesh)
          sw.mesh.geometry.dispose()
          ;(sw.mesh.material as THREE.MeshBasicMaterial).dispose()
          shockwaves.splice(i, 1)
        }
      }

      // Magnetic Cursor Fluid Particles Attraction
      const pPositions = particleGeo.attributes.position.array as Float32Array
      const cursorWorldX = mouseVec.x * 4.5
      const cursorWorldY = mouseVec.y * 3

      for (let i = 0; i < particleCount; i++) {
        let px = pPositions[i * 3]
        let py = pPositions[i * 3 + 1]

        // Distance to cursor
        const dx = cursorWorldX - px
        const dy = cursorWorldY - py
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 2.5) {
          const pull = (1 - dist / 2.5) * 0.02
          pPositions[i * 3] += dx * pull
          pPositions[i * 3 + 1] += dy * pull
        } else {
          pPositions[i * 3] += velocities[i].x
          pPositions[i * 3 + 1] += velocities[i].y
          pPositions[i * 3 + 2] += velocities[i].z
        }

        if (Math.abs(pPositions[i * 3]) > 7) pPositions[i * 3] *= -1
        if (Math.abs(pPositions[i * 3 + 1]) > 4.5) pPositions[i * 3 + 1] *= -1
        if (Math.abs(pPositions[i * 3 + 2]) > 3) pPositions[i * 3 + 2] *= -1
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("click", onClick)
      window.removeEventListener("dblclick", onDoubleClick)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(reqId)

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing overflow-hidden">
      {interactiveMsg && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-black/70 border border-amber-500/40 backdrop-blur-md text-[11px] font-mono text-amber-400 font-semibold shadow-lg animate-pulse">
          {interactiveMsg}
        </div>
      )}
    </div>
  )
}
