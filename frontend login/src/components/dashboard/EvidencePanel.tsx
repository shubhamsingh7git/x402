import React from 'react';
import { EvidenceSignal } from '@/types';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface EvidencePanelProps {
  evidence: EvidenceSignal[];
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        Signals Observed
        <span className="text-xs font-normal px-2 py-0.5 bg-white/10 rounded-full text-zinc-400">
          {evidence.length}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evidence.map((signal, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
            key={signal.id}
            className="glass-panel p-5 transition-all group relative border border-white/5 hover:border-white/20"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-zinc-200">{signal.label}</span>
              <div className="relative flex items-center justify-center">
                <Info className="w-4 h-4 text-zinc-500 cursor-help peer hover:text-zinc-300 transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-zinc-800 text-xs text-zinc-200 rounded-lg shadow-xl opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all z-10 border border-white/10">
                  {signal.explanation}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Confidence Level</span>
                <span className={cn(
                  "font-medium",
                  signal.level === 'high' ? "text-rose-400" :
                  signal.level === 'moderate' ? "text-amber-400" :
                  "text-emerald-400"
                )}>
                  {signal.confidence}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${signal.confidence}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full shadow-[0_0_10px_currentColor]",
                    signal.level === 'high' ? "bg-rose-500 text-rose-500" :
                    signal.level === 'moderate' ? "bg-amber-500 text-amber-500" :
                    "bg-emerald-500 text-emerald-500"
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
