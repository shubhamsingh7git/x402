import React from 'react';
import { AssessmentResult } from '@/types';
import { AlertTriangle, CheckCircle, ShieldAlert, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface DecisionPanelProps {
  decision: AssessmentResult['decision'];
  explanation: string;
  suggestedAction: string;
}

export function DecisionPanel({ decision, explanation, suggestedAction }: DecisionPanelProps) {
  const config = {
    'Allow': {
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
    },
    'Warn User': {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
    },
    'Flag for Review': {
      icon: ShieldAlert,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]'
    },
    'Human Required': {
      icon: UserX,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
    }
  }[decision];

  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {/* Animated Glow Border */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute inset-0 rounded-xl blur-md -z-10", config.bg)}
      />
      
      <div className={cn("rounded-xl border p-6 backdrop-blur-xl bg-background/80", config.border, config.shadow)}>
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-full bg-background/50 border border-white/5", config.color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-zinc-100">
              Recommended Action: <span className={config.color}>{decision}</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {explanation}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Suggested Next Step
              </span>
              <p className="text-sm font-medium text-zinc-200">
                {suggestedAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
