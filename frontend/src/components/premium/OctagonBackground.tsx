import React from "react"

/**
 * OctagonBackground — A strict monochrome interpretation of the geometric architecture.
 * Adapts beautifully to both stark white (Light Mode) and void black (Dark Mode) themes.
 */
export const OctagonBackground = React.memo(function OctagonBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background transition-colors duration-700">
      
      {/* 
        Central Geometric Structure 
        Sharp, high-contrast lines inspired by the uploaded image.
      */}
      <svg 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.15] dark:opacity-20 animate-spin-slow text-black dark:text-white transition-colors duration-700" 
        viewBox="0 0 1000 1000" 
        fill="none"
      >
        {/* Outer Octagon */}
        <polygon 
          points="500,100 782,218 900,500 782,782 500,900 218,782 100,500 218,218" 
          stroke="currentColor" 
          strokeWidth="3" 
        />
        <polygon 
          points="500,120 762,238 880,500 762,762 500,880 238,762 120,500 238,238" 
          stroke="currentColor" 
          strokeWidth="1" 
          opacity="0.5"
        />

        {/* Diagonal Cross beams */}
        <line x1="218" y1="218" x2="782" y2="782" stroke="currentColor" strokeWidth="4" />
        <line x1="782" y1="218" x2="218" y2="782" stroke="currentColor" strokeWidth="4" />
        
        {/* Vertical and Horizontal beams */}
        <line x1="500" y1="100" x2="500" y2="900" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="100" y1="500" x2="900" y2="500" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Inner Octagon */}
        <polygon 
          points="500,250 676,324 750,500 676,676 500,750 324,676 250,500 324,324"
          stroke="currentColor"
          strokeWidth="8"
        />
        
        {/* Wire accents connecting rings */}
        <line x1="500" y1="100" x2="500" y2="250" stroke="currentColor" strokeWidth="1" />
        <line x1="782" y1="218" x2="676" y2="324" stroke="currentColor" strokeWidth="1" />
        <line x1="900" y1="500" x2="750" y2="500" stroke="currentColor" strokeWidth="1" />
        <line x1="782" y1="782" x2="676" y2="676" stroke="currentColor" strokeWidth="1" />
        <line x1="500" y1="900" x2="500" y2="750" stroke="currentColor" strokeWidth="1" />
        <line x1="218" y1="782" x2="324" y2="676" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="500" x2="250" y2="500" stroke="currentColor" strokeWidth="1" />
        <line x1="218" y1="218" x2="324" y2="324" stroke="currentColor" strokeWidth="1" />

        {/* Node boxes on outer ring */}
        {[
          [500, 100], [782, 218], [900, 500], [782, 782],
          [500, 900], [218, 782], [100, 500], [218, 218]
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx - 10} y={cy - 10} width={20} height={20} 
            stroke="currentColor" strokeWidth="2" fill="none"
            transform={`rotate(45 ${cx} ${cy})`}
          />
        ))}
      </svg>

      {/* 
        A secondary glitching layer for "creativity" and futuristic movement.
      */}
      <svg 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.03] dark:opacity-[0.05] animate-glitch animate-spin-slow mix-blend-difference text-black dark:text-white" 
        viewBox="0 0 1000 1000" 
        fill="none"
        style={{ willChange: "transform" }}
      >
        <polygon 
          points="500,100 782,218 900,500 782,782 500,900 218,782 100,500 218,218" 
          stroke="currentColor" 
          strokeWidth="10" 
        />
        <line x1="218" y1="218" x2="782" y2="782" stroke="currentColor" strokeWidth="10" />
      </svg>

      {/* Volumetric / Spot light beams adapting to theme */}
      <div className="absolute inset-0 opacity-20 dark:opacity-20 mix-blend-overlay">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] hidden dark:block"
          style={{
            background: `
              linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%),
              linear-gradient(225deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%)
            `
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] block dark:hidden"
          style={{
            background: `
              linear-gradient(135deg, transparent 35%, rgba(0,0,0,0.2) 50%, transparent 65%),
              linear-gradient(225deg, transparent 35%, rgba(0,0,0,0.15) 50%, transparent 65%)
            `
          }}
        />
      </div>

      {/* Subtle sharp gradient fade out at edges (Theme-aware) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_80%)] opacity-90 transition-colors duration-700" />

      {/* Noise overlay for premium texture */}
      <div className="absolute inset-0 noise-overlay mix-blend-multiply dark:mix-blend-screen" />
    </div>
  )
})
