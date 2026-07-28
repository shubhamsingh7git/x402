import React from 'react';
import { motion } from 'motion/react';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '../AnimatedCounter';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  // SVG Geometry
  const cx = 100;
  const cy = 100;
  const r = 80;
  const strokeWidth = 16;
  
  // Path length = pi * r
  const circumference = Math.PI * r;
  // Map score (0-100) to strokeDashoffset
  // 0 score = full offset (circumference)
  // 100 score = 0 offset
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClass = 
    level === 'low' ? 'text-emerald-500' :
    level === 'moderate' ? 'text-amber-500' :
    'text-rose-500';

  return (
    <div className="relative w-full max-w-[280px] mx-auto flex flex-col items-center">
      <svg
        viewBox="0 0 200 110"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="risk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />   {/* emerald-500 */}
            <stop offset="50%" stopColor="#f59e0b" />  {/* amber-500 */}
            <stop offset="100%" stopColor="#ef4444" /> {/* rose-500 */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-white/10"
        />
        
        {/* Foreground Arc */}
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#risk-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          filter="url(#glow)"
        />
      </svg>
      
      {/* Text Content */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={cn("font-doto text-5xl md:text-6xl font-bold tracking-tighter leading-none", colorClass)}
        >
          <AnimatedCounter value={score} duration={1.5} />
        </motion.div>
        <span className="font-doto text-xs font-medium text-zinc-500 uppercase tracking-wider mt-2">
          Risk Score
        </span>
      </div>
    </div>
  );
}
