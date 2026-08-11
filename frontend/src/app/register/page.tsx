"use client";

import React, { useState } from "react";
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
import { Lock, Mail, User as UserIcon, ArrowRight, Bot } from "lucide-react";
import { AuroraBackground } from "@/components/login/AuroraBackground";
import { PremiumInput } from "@/components/login/PremiumInput";
import { HeroButton } from "@/components/login/HeroButton";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await authService.register(data.name, data.email, data.password);
      setAuth(res.user, res.token);
      setSuccess(true);
      setTimeout(() => router.push(ROUTES.DASHBOARD), 1800);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to register user");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      <AuroraBackground />

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[420px] relative"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient border glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-3xl opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
              }}
              animate={{
                background: [
                  "linear-gradient(0deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                  "linear-gradient(120deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                  "linear-gradient(240deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                  "linear-gradient(360deg, hsl(var(--primary) / 0.4), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] -translate-y-1/2 opacity-20 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
                  filter: "blur(60px)",
                }}
              />

              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-8">
                  <motion.div
                    className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg mb-5 relative"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover relative z-10" />
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-primary/50"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight">Create Account</h1>
                  <p className="text-xs text-muted-foreground font-mono mt-2 max-w-[280px]">
                    Register for x402 Commerce Platform Access
                  </p>
                </motion.div>

                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center gap-3 text-xs text-destructive font-mono"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">!</span>
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-5" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <PremiumInput
                      icon={UserIcon}
                      label="Full Name"
                      type="text"
                      placeholder="Enterprise Admin"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PremiumInput
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      placeholder="admin@x402.io"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PremiumInput
                      icon={Lock}
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2">
                    <HeroButton
                      type="submit"
                      loading={isLoading && !success}
                      success={success}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Create Account & Sign In
                    </HeroButton>
                  </motion.div>
                </motion.form>

                <motion.div variants={itemVariants} className="mt-8 text-center text-xs font-mono text-muted-foreground">
                  Already registered?{" "}
                  <Link href={ROUTES.AUTH.LOGIN} className="text-primary font-bold hover:underline">
                    Sign in here
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-6 text-center text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Secured by x402 Protocol · Base L2
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
