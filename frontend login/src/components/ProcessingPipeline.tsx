import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 0, title: 'Pre-processing', description: 'Normalizing input and extracting metadata' },
  { id: 1, title: 'Evidence Extraction', description: 'Identifying signals, linguistic patterns, and source traces' },
  { id: 2, title: 'Reasoning', description: 'Synthesizing evidence across multi-agent consensus' },
  { id: 3, title: 'Safety Decision', description: 'Formulating final risk score and recommended actions' },
];

interface ProcessingPipelineProps {
  currentStep: number;
}

export function ProcessingPipeline({ currentStep }: ProcessingPipelineProps) {
  // Calculate progress percentage for the connecting line
  const progressPercentage = Math.min(100, Math.max(0, (currentStep / (STEPS.length - 1)) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Analyzing Content</h2>
        <p className="text-zinc-400">DARE multi-agent system is processing your request...</p>
      </div>

      <div className="relative space-y-8">
        {/* Background Line */}
        <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-0.5 bg-white/10 -translate-x-1/2" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-0 left-5 md:left-1/2 w-0.5 bg-blue-500 -translate-x-1/2 origin-top shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          initial={{ height: "0%" }}
          animate={{ height: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors duration-500",
                isCompleted ? "text-emerald-500 border-emerald-500/20" : isCurrent ? "text-blue-400 border-blue-500/30" : "text-zinc-600 border-white/5"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              {/* Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={!isPending ? { scale: 1.02, y: -2 } : {}}
                className={cn(
                  "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border transition-all duration-500",
                  isCurrent ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]" : 
                  isCompleted ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-transparent border-transparent"
                )}
              >
                <div className="flex flex-col">
                  <h3 className={cn(
                    "font-semibold text-sm mb-1 transition-colors",
                    isCurrent ? "text-blue-400" : isCompleted ? "text-zinc-200" : "text-zinc-500"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-xs transition-colors",
                    isCurrent ? "text-blue-200/70" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
