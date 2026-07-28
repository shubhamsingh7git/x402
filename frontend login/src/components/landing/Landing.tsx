import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, BrainCircuit, Lock, CheckCircle2, Search, FileText } from 'lucide-react';
import { AnimatedCounter } from '../AnimatedCounter';
import { WovenLightHero } from '../ui/woven-light-hero';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <WovenLightHero onStart={onStart} />

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Not a Truth Detector. <br/>A Risk Assessment Engine.</h2>
                <p className="text-zinc-400 leading-relaxed">
                  DARE does not arbitrate absolute truth. Instead, it acts as an advanced decision-support system for human moderators. 
                  By analyzing linguistic patterns, source credibility, and manipulation traces, it provides a transparent risk score and actionable recommendations.
                </p>
                <ul className="space-y-3">
                  {['Extracts verifiable signals', 'Provides explainable reasoning', 'Recommends safety actions'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                <div className="relative glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-sm text-zinc-400">Risk Score</span>
                    <span className="text-rose-400 font-bold">82 / 100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[82%] bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" />
                    </div>
                    <p className="text-xs text-zinc-500 text-right">High Risk Profile</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-24 px-6 bg-black/40 relative z-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">A transparent, three-step pipeline designed for explainability.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Evidence Extraction', desc: 'Identifies linguistic patterns, emotional manipulation, and source credibility signals.' },
              { icon: BrainCircuit, title: 'Risk Reasoning', desc: 'Multi-agent consensus synthesizes signals to calculate a comprehensive risk score.' },
              { icon: Shield, title: 'Safety & Ethics', desc: 'Applies platform policies to recommend actions like Warn, Flag, or Human Review.' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 rounded-2xl text-center group hover:bg-white/[0.05] transition-all"
              >
                <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-zinc-200">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Capabilities</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Built for scale, transparency, and trust.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: BrainCircuit, title: 'Multi-Agent System', desc: 'Specialized AI agents handle ingestion, linguistic analysis, and policy evaluation independently.' },
              { icon: FileText, title: 'Transparency & Auditability', desc: 'Every decision is logged. View the exact reasoning and signals used by each agent.' },
              { icon: Activity, title: 'Risk Scoring (Not Truth)', desc: 'Focuses on identifying manipulation tactics and risk vectors rather than arbitrating absolute truth.' },
              { icon: Lock, title: 'Human-in-the-loop Safety', desc: 'Designed to empower human moderators with rich context, not replace them.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-zinc-200">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-blue-900/10 border-y border-blue-500/10 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Analyses Run', value: 1.2, suffix: 'M+' },
            { label: 'Threats Flagged', value: 340, suffix: 'K' },
            { label: 'Safe Content', value: 85, suffix: '%' },
            { label: 'Active Agents', value: 5, suffix: '' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-zinc-100 flex items-center justify-center">
                <AnimatedCounter value={stat.value} duration={2} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-sm font-medium text-blue-400/80 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">Ready to Assess Risk?</h2>
          <p className="text-xl text-zinc-400">
            Start using DARE to analyze content authenticity and protect your platform.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Start Your First Analysis
          </motion.button>
        </div>
      </section>
    </div>
  );
}
