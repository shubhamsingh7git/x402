"use client";

import { useEffect, useState, useRef, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Bot, Cpu, Shield, LineChart, Blocks, Store,
  ArrowRight, Zap, CheckCircle2,
  GitFork, MessageCircle, Globe, ChevronDown,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/LandingNav";
import { TickerStrip } from "@/components/landing/TickerStrip";
import { ScrollRevealSection } from "@/components/landing/ScrollRevealSection";
import { TiltCard } from "@/components/landing/TiltCard";

// Lazy-load the Three.js scene for performance
const HeroScene3D = lazy(() =>
  import("@/components/landing/HeroScene3D").then((mod) => ({
    default: mod.HeroScene3D,
  }))
);

/* ─── Animated Counter ─── */
function AnimatedStat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Observe element visibility with proper lifecycle
  useEffect(() => {
    const el = elementRef.current;
    if (!el || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let step = 0;
    const steps = 50;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisplay(value * ease);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value, started]);

  return (
    <span className="tabular-nums" ref={elementRef}>
      {Number.isInteger(value)
        ? Math.round(display).toLocaleString()
        : display.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ─── Features Data ─── */
const FEATURES = [
  {
    icon: Bot, title: "AI Agent Orchestration",
    desc: "Deploy autonomous AI agents that research, transact, and settle payments on-chain with full policy compliance.",
    tag: "LIVE", tagColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Blocks, title: "x402 Protocol",
    desc: "HTTP-native payment protocol enabling machines to pay machines. Built on Base L2 with sub-second finality.",
    tag: "LIVE", tagColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Shield, title: "Policy Engine",
    desc: "Multi-layered spending governance with per-agent caps, velocity limits, merchant whitelists, and real-time enforcement.",
    tag: "LIVE", tagColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: LineChart, title: "Real-time Analytics",
    desc: "Full observability into agent spend velocity, settlement throughput, and policy violation telemetry across all pipelines.",
    tag: "LIVE", tagColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Cpu, title: "Blockchain Settlement",
    desc: "Native USDC settlement on Base L2 via Coinbase Developer Platform. Every transaction verifiable on-chain.",
    tag: "LIVE", tagColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Store, title: "Service Bazaar",
    desc: "Discover and integrate third-party AI services, payment providers, and data feeds into your agent workflows.",
    tag: "COMING SOON", tagColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
];

const STEPS = [
  { num: "01", title: "Deploy Agents", desc: "Spin up autonomous AI agents with customizable research pipelines, payment capabilities, and memory." },
  { num: "02", title: "Set Policies", desc: "Define spending caps, velocity limits, merchant whitelists, and approval workflows to govern agent behavior." },
  { num: "03", title: "Settle on Chain", desc: "Every approved transaction settles instantly on Base L2. Full audit trail, cryptographic receipts, zero trust." },
];

/* ─── Word-by-word text reveal ─── */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: 0.3 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <LandingNav />

      {/* ════════════ HERO ════════════ */}
      <motion.section
        className="relative z-10 min-h-screen flex items-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Three.js background */}
        <Suspense
          fallback={
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
              }}
            />
          }
        >
          <HeroScene3D />
        </Suspense>

        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-mono font-bold tracking-wider uppercase mb-8"
            >
              <Zap className="w-3 h-3" />
              $2.7M+ PROCESSED ON-CHAIN
            </motion.div>

            {/* Headline with word reveal */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              <RevealText text="The Future of" />
              <br />
              <span className="text-primary">
                <RevealText text="Agentic" />
              </span>{" "}
              <RevealText text="Commerce" />
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              The enterprise platform where autonomous AI agents research, transact,
              and settle payments on-chain — governed by policy, verified by blockchain.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button size="lg" className="font-mono text-sm cursor-pointer gap-2 group">
                  LAUNCH DASHBOARD
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="font-mono text-sm cursor-pointer">
                  EXPLORE FEATURES
                </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ════════════ TICKER ════════════ */}
      <TickerStrip />

      {/* ════════════ STATS ════════════ */}
      <section id="stats" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <ScrollRevealSection animation="scaleIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Transactions Processed", value: 48250, suffix: "+" },
              { label: "Active AI Agents", value: 12, suffix: "" },
              { label: "Avg Settlement", value: 0.8, suffix: "s" },
              { label: "Platform Uptime", value: 99.99, suffix: "%" },
            ].map((stat, i) => (
              <TiltCard key={i}>
                <div className="p-6 text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-2">
                    <AnimatedStat value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </ScrollRevealSection>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <ScrollRevealSection animation="fadeUp" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            The Agentic Commerce Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to deploy, govern, and scale autonomous AI agent payments — from research to settlement.
          </p>
        </ScrollRevealSection>

        <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center my-10 [perspective:1000px] sm:[perspective:1200px] group">
          <div className="relative w-[280px] sm:w-[320px] h-[320px] sm:h-[350px] animate-carousel-rotate-3d group-hover:[animation-play-state:paused]">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              // 6 items total -> 360 / 6 = 60 degrees apart
              const rotateY = i * 60;
              // translateZ pushes the cards outwards to form the cylinder
              // (width/2) / tan(30deg) = ~160 / 0.577 = ~277px + spacing
              const translateZ = 320;

              return (
                <div
                  key={feat.title}
                  className="absolute inset-0 flex flex-col"
                  style={{
                    transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                    backfaceVisibility: "hidden", // Prevents interaction with rear-facing cards
                  }}
                >
                  <TiltCard className="w-full h-full flex flex-col">
                    <div className="p-6 flex-grow flex flex-col justify-start text-left">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${feat.tagColor}`}
                        >
                          {feat.tag}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <ScrollRevealSection animation="maskReveal" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three steps to autonomous, policy-governed, on-chain commerce.
          </p>
        </ScrollRevealSection>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <ScrollRevealSection
              key={step.num}
              animation="depthPush"
              delay={i * 0.15}
            >
              <TiltCard>
                <div className="p-8 relative overflow-hidden">
                  <div className="text-6xl font-black text-primary/10 absolute top-4 right-6 select-none">
                    {step.num}
                  </div>
                  <div className="relative z-10">
                    <CheckCircle2 className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="relative z-10 py-24 px-6">
        <ScrollRevealSection animation="scaleIn">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Background glow */}
            <div
              className="absolute inset-0 -z-10 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(var(--primary) / 0.3) 0%, transparent 60%)",
                filter: "blur(80px)",
              }}
            />
            <TiltCard>
              <div className="p-12 sm:p-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6">
                  Ready to build the future?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
                  Deploy autonomous AI agents with enterprise-grade policy governance and on-chain settlement. Get started in minutes.
                </p>
                <Link href={ROUTES.AUTH.REGISTER}>
                  <Button size="lg" className="font-mono text-sm cursor-pointer gap-2">
                    GET STARTED FREE <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </TiltCard>
          </div>
        </ScrollRevealSection>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="relative z-10 border-t border-border">
        {/* Animated gradient top line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          {/* Subtle background particles */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 80% 30%, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "100px 100px, 80px 80px",
            }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                  <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover" />
                </div>
                <span className="font-mono font-bold text-foreground">x402</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enterprise agentic commerce platform. AI agents that pay, governed by policy, verified by blockchain.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">Protocol</a></li>
                <li><a href="#stats" className="hover:text-primary transition-colors">Statistics</a></li>
                <li><Link href={ROUTES.AUTH.LOGIN} className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status Page</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Community
              </h4>
              <div className="flex items-center gap-3">
                {[GitFork, MessageCircle, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2.5 rounded-xl border border-border hover:border-primary/40 hover:text-primary text-muted-foreground transition-all hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <span>© 2026 x402 Protocol. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
