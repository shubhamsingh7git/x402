"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/api/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";
import { Lock, Mail, ArrowRight, Bot, Eye, EyeOff } from "lucide-react";
import { AuroraBackground } from "@/components/login/AuroraBackground";
import { CinematicLoginScene } from "@/components/login/CinematicLoginScene";
import { AnimatedCharacters } from "@/components/login/AnimatedCharacters";
import { HeroButton } from "@/components/login/HeroButton";

/* ─── Schema ─── */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

/* ─── Stagger animation config ─── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── PremiumLoginInput — inline premium input with animated border ─── */
interface PremiumLoginInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const PremiumLoginInput = React.forwardRef<
  HTMLInputElement,
  PremiumLoginInputProps
>(({ icon: Icon, label, error, rightElement, className, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      {label && (
        <motion.label
          className="block text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono"
          animate={{
            color: focused
              ? "hsl(var(--primary))"
              : hasError
              ? "hsl(var(--destructive))"
              : undefined,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      <div
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-xl opacity-0 pointer-events-none"
          style={{
            background: hasError
              ? "linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.5), hsl(var(--destructive)))"
              : "linear-gradient(var(--gradient-angle, 135deg), hsl(var(--primary)), hsl(var(--primary) / 0.4), hsl(var(--primary)))",
            backgroundSize: "300% 300%",
          }}
          animate={{
            opacity: focused ? 1 : hovered ? 0.5 : 0,
            backgroundPosition: focused
              ? ["0% 0%", "100% 100%", "0% 0%"]
              : "0% 0%",
          }}
          transition={{
            opacity: { duration: 0.2 },
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* Glow */}
        <motion.div
          className="absolute -inset-2 rounded-2xl pointer-events-none"
          style={{
            background: hasError
              ? "radial-gradient(circle, hsl(var(--destructive) / 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
          animate={{ opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative"
          animate={hasError ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
          transition={hasError ? { duration: 0.4, ease: "easeInOut" } : {}}
        >
          {/* Leading icon */}
          {Icon && (
            <motion.div
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              animate={{
                scale: focused ? 1.1 : 1,
                color: focused
                  ? "hsl(var(--primary))"
                  : hasError
                  ? "hsl(var(--destructive))"
                  : undefined,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}

          <input
            ref={ref}
            className={[
              "w-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl text-sm text-foreground font-mono",
              "placeholder:text-muted-foreground/50 transition-colors duration-200",
              "focus:outline-none focus:bg-card/80",
              Icon ? "pl-10" : "px-4",
              rightElement ? "pr-12" : "pr-4",
              "py-3",
              hasError && "border-destructive/50 bg-destructive/5",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right element slot (password toggle) */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {rightElement}
            </div>
          )}
        </motion.div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            className="text-[11px] text-destructive font-mono flex items-center gap-1.5 pl-1"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
PremiumLoginInput.displayName = "PremiumLoginInput";

/* ═══════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════ */
export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [phase, setPhase] = useState<"particles" | "form" | "transitioning">("particles");

  // Reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Callback when particle animation completes
  const handleParticlesComplete = useCallback(() => {
    setPhase("form");
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@x402.io",
      password: "Password@123",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = useCallback(
    async (data: LoginFormInputs) => {
      setErrorMsg(null);
      setIsLoading(true);
      try {
        const res = await authService.login(data.email, data.password);
        setAuth(res.user, res.token);
        setLoginSuccess(true);

        // Cinematic transition delay before navigation
        setTimeout(() => {
          setPhase("transitioning");
          setTimeout(() => {
            router.push(ROUTES.DASHBOARD);
          }, 1200);
        }, 1500);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMsg(
          err.response?.data?.message ||
            err.message ||
            "Failed to authenticate"
        );
      }
    },
    [router, setAuth]
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Aurora animated background (covers full page) */}
      <AuroraBackground />

      {/* ── Cinematic particle "x402" intro (Scene 1 & 2) ── */}
      <CinematicLoginScene
        onSceneComplete={handleParticlesComplete}
        reducedMotion={reducedMotion}
      />

      {/* ── Post-login cinematic transition ── */}
      <AnimatePresence>
        {phase === "transitioning" && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.5) 40%, transparent 70%)",
              }}
              initial={{ width: 40, height: 40, opacity: 0.8 }}
              animate={{
                width: [40, 120, 4000],
                height: [40, 120, 4000],
                opacity: [0.8, 0.6, 0],
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark overlay during particles phase */}
      {phase === "particles" && !reducedMotion && (
        <motion.div
          className="fixed inset-0 z-[5] bg-[#050505]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 6, duration: 1 }}
        />
      )}

      {/* ══════════════ SPLIT LAYOUT (appears after particles) ══════════════ */}
      <AnimatePresence>
        {(phase === "form" || phase === "transitioning" || (reducedMotion && phase === "particles")) && (
          <motion.div
            className="relative z-20 min-h-screen grid lg:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
        {/* ── LEFT PANEL: Characters (desktop only) ── */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Branding top-left */}
          <motion.div
            className="relative z-20 p-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg">
                <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover" />
              </div>
              <span className="font-mono font-black text-lg tracking-tight text-foreground">
                x402
              </span>
            </div>
          </motion.div>

          {/* Characters scene — vertically centered */}
          <motion.div
            className="relative z-20 flex-1 flex items-end justify-center pb-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedCharacters
              isTyping={isInputFocused}
              passwordLength={passwordValue?.length ?? 0}
              showPassword={showPassword}
              reducedMotion={reducedMotion}
            />
          </motion.div>

          {/* Bottom ambient text */}
          <motion.div
            className="relative z-20 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-xs font-mono text-muted-foreground/60 max-w-[320px] leading-relaxed">
              Autonomous AI agents that research, transact, and settle payments
              on-chain — governed by policy, verified by blockchain.
            </p>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL: Login Form ── */}
        <div className="flex items-center justify-center p-3 sm:p-8 lg:p-12">
          <motion.div
            className="w-full max-w-[420px] relative px-1 sm:px-0"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
          >
            {/* ── Card with animated border ── */}
            <div className="relative rounded-3xl overflow-hidden">
              {/* Rotating gradient border glow */}
              <motion.div
                className="absolute -inset-[1px] rounded-3xl opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                }}
                animate={{
                  background: [
                    "linear-gradient(0deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                    "linear-gradient(90deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                    "linear-gradient(180deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                    "linear-gradient(270deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                    "linear-gradient(360deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Card body */}
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl p-5 sm:p-10 shadow-2xl">
                {/* Top glow inside card */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] -translate-y-1/2 opacity-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
                    filter: "blur(60px)",
                  }}
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* ── Mobile: Show characters above form ── */}
                  <motion.div
                    variants={itemVariants}
                    className="lg:hidden flex justify-center mb-6 -mt-2"
                  >
                    <div className="transform scale-[0.55] origin-bottom">
                      <AnimatedCharacters
                        isTyping={isInputFocused}
                        passwordLength={passwordValue?.length ?? 0}
                        showPassword={showPassword}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                  </motion.div>

                  {/* ── Logo + Title ── */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center mb-8"
                  >
                    <motion.div
                      className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg mb-5 relative"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover relative z-10" />
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border border-primary/50"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>

                    <h1 className="text-2xl font-black text-foreground tracking-tight">
                      Welcome Back
                    </h1>
                    <p className="text-xs text-muted-foreground font-mono mt-2 max-w-[280px]">
                      Sign in to access your Agentic Commerce Dashboard
                    </p>
                  </motion.div>

                  {/* ── Error alert ── */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center gap-3 text-xs text-destructive font-mono"
                      >
                        <span className="shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center font-bold">
                          !
                        </span>
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Form ── */}
                  <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    variants={containerVariants}
                  >
                    {/* Email */}
                    <motion.div variants={itemVariants}>
                      <PremiumLoginInput
                        icon={Mail}
                        label="Email Address"
                        type="email"
                        placeholder="admin@x402.io"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                        onFocus={(e) => {
                          setIsInputFocused(true);
                          register("email").onBlur(e);
                        }}
                        onBlur={(e) => {
                          setIsInputFocused(false);
                          register("email").onBlur(e);
                        }}
                      />
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-mono">
                          Password
                        </label>
                        <Link
                          href={ROUTES.AUTH.FORGOT_PASSWORD}
                          className="text-[11px] text-primary hover:underline font-mono"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <PremiumLoginInput
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        }
                        {...register("password")}
                        onFocus={(e) => {
                          setIsInputFocused(true);
                          register("password").onBlur(e);
                        }}
                        onBlur={(e) => {
                          setIsInputFocused(false);
                          register("password").onBlur(e);
                        }}
                      />
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={itemVariants} className="pt-2">
                      <HeroButton
                        type="submit"
                        loading={isLoading && !loginSuccess}
                        success={loginSuccess}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Sign In to Dashboard
                      </HeroButton>
                    </motion.div>
                  </motion.form>

                  {/* Register link */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center text-xs font-mono text-muted-foreground"
                  >
                    Don&apos;t have an account?{" "}
                    <Link
                      href={ROUTES.AUTH.REGISTER}
                      className="text-primary font-bold hover:underline"
                    >
                      Register here
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom ambient label */}
            <motion.div
              className="mt-6 text-center text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Secured by x402 Protocol · Base L2
            </motion.div>
          </motion.div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
