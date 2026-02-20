"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  baseX: number
  baseY: number
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const PARTICLE_COUNT = 60
    const CONNECTION_DISTANCE = 150
    const MOUSE_INFLUENCE = 200
    const MOUSE_REPULSION = 0.02

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const spawnParticle = (): Particle => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.4 + 0.2,
      }
    }

    resize()
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, spawnParticle)

    let frameCount = 0
    const draw = () => {
      frameCount++
      // Render a cada 2 frames para performance (30fps)
      if (frameCount % 2 !== 0) {
        animationIdRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update & draw particles
      for (const p of particlesRef.current) {
        // Mouse interaction - gentle repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < MOUSE_INFLUENCE && dist > 0) {
          const force = (MOUSE_INFLUENCE - dist) * MOUSE_REPULSION
          p.vx += (dx / dist) * force * 0.01
          p.vy += (dy / dist) * force * 0.01
        }

        // Return to base position slowly
        p.vx += (p.baseX - p.x) * 0.001
        p.vy += (p.baseY - p.y) * 0.001

        // Apply velocity with damping
        p.vx *= 0.98
        p.vy *= 0.98
        
        p.x += p.vx
        p.y += p.vy

        // Boundary bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2)
        gradient.addColorStop(0, `rgba(16, 188, 169, ${p.opacity})`)
        gradient.addColorStop(1, `rgba(16, 188, 169, 0)`)
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16, 188, 169, ${p.opacity})`
        ctx.fill()
      }

      // Draw connections with gradient
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.2
            
            // Gradient line
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            gradient.addColorStop(0, `rgba(16, 188, 169, ${alpha})`)
            gradient.addColorStop(0.5, `rgba(16, 188, 169, ${alpha * 1.5})`)
            gradient.addColorStop(1, `rgba(16, 188, 169, ${alpha})`)
            
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(draw)
    }

    draw()

    const observer = new ResizeObserver(resize)
    observer.observe(document.body)
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      observer.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
      {/* Gradient overlay for depth */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 188, 169, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(16, 188, 169, 0.05) 0%, transparent 40%)
          `,
        }}
      />
    </>
  )
}
