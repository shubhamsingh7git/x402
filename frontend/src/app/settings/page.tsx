"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { Settings as SettingsIcon, User, Lock, Bell, Moon, LogOut, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [passUpdated, setPassUpdated] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const { resolvedTheme } = useTheme();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdated(true);
    setCurrentPass("");
    setNewPass("");
    setTimeout(() => setPassUpdated(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-primary" />
              <span>Platform Settings & Account Configuration</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              User profile, password management, notification triggers, and API session security
            </p>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="glass-card p-6 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <User className="w-4 h-4 text-primary" />
            <span>User Profile Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-background border border-border rounded-xl">
              <div className="text-[10px] text-muted-foreground uppercase">Full Name</div>
              <div className="text-foreground font-bold text-sm mt-1">{user?.name || "Enterprise Admin"}</div>
            </div>
            <div className="p-3 bg-background border border-border rounded-xl">
              <div className="text-[10px] text-muted-foreground uppercase">Email Address</div>
              <div className="text-primary font-bold text-sm mt-1">{user?.email || "admin@x402.io"}</div>
            </div>
          </div>
        </div>

        {/* Password Security Form */}
        <div className="glass-card p-6 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Lock className="w-4 h-4 text-primary" />
            <span>Password & Security Management</span>
          </h3>

          {passUpdated && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <Button
              type="submit"
              size="default"
              className="cursor-pointer"
            >
              Update Password
            </Button>
          </form>
        </div>

        {/* API Connection & Theme Info */}
        <div className="glass-card p-6 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Moon className="w-4 h-4 text-primary" />
            <span>Theme & Environment Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-background border border-border rounded-xl">
              <div className="text-[10px] text-muted-foreground uppercase">Active Theme</div>
              <div className="text-primary font-bold mt-1 uppercase">
                {resolvedTheme === "dark" ? "Cyber Orange Dark Theme" : "Warm Paper Light Theme"}
              </div>
            </div>
            <div className="p-3 bg-background border border-border rounded-xl">
              <div className="text-[10px] text-muted-foreground uppercase">Backend API URL</div>
              <div className="text-foreground font-bold mt-1">http://localhost:5000/api/v1</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
