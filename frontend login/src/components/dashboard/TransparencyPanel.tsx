import React, { useState } from 'react';
import { AgentLog } from '@/types';
import { ChevronDown, ChevronUp, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransparencyPanelProps {
  logs: AgentLog[];
}

export function TransparencyPanel({ logs }: TransparencyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel overflow-hidden border border-white/5 transition-colors hover:border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-zinc-200">Transparency & Audit Log</h3>
            <p className="text-xs text-zinc-500">View agent-by-agent breakdown and reasoning</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" /> : <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/10 bg-black/20 overflow-hidden"
          >
            <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              {logs.map((log, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  key={index} 
                  className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:hidden before:w-px before:bg-white/10"
                >
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-background border border-white/10 rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <Activity className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="space-y-1 bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {log.agentName}
                      </span>
                      <span className="text-xs text-zinc-600 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-300">{log.action}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{log.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
