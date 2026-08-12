"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Bot,
  CreditCard,
  ShieldCheck,
  Server,
  FileText,
  LineChart,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Store,
  User,
  Menu,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { isFeatureEnabled } from "@/constants/features";
import { useAuthStore } from "@/store/useAuthStore";
import { LiveStatus } from "../ui/LiveStatus";
import { ThemeToggle } from "../ThemeToggle";
import { NotificationCenter } from "../shared/NotificationCenter";
import { GlobalSearchModal } from "../shared/GlobalSearchModal";
import { OctagonBackground } from "../premium/OctagonBackground";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initSession = useAuthStore((state) => state.initSession);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = React.useMemo(
    () => [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "AI Research", href: ROUTES.RESEARCH, icon: Bot },
      { label: "Merchants", href: ROUTES.MERCHANTS.LIST, icon: Building2 },
      { label: "Transactions", href: ROUTES.TRANSACTIONS.LIST, icon: CreditCard },
      { label: "Spend Policies", href: ROUTES.POLICIES, icon: ShieldCheck },
      { label: "API Services", href: ROUTES.SERVICES, icon: Server },
      { label: "Analytics", href: ROUTES.ANALYTICS, icon: LineChart },
      { label: "Audit Logs", href: ROUTES.AUDIT, icon: FileText },
      { label: "System Health", href: ROUTES.HEALTH, icon: Activity },
      ...(isFeatureEnabled("BAZAAR")
        ? [{ label: "Service Bazaar", href: ROUTES.BAZAAR.DISCOVERY, icon: Store }]
        : []),
      { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
    ],
    []
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push(ROUTES.AUTH.LOGIN);
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/20 grid-lines relative overflow-hidden">
        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Geometric Wireframe Background */}
        <OctagonBackground />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card/90 border border-border rounded-xl text-foreground shadow-md backdrop-blur-md"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 bottom-0 left-0 z-40 bg-card/85 border-r border-border backdrop-blur-xl transition-all duration-300 flex flex-col shadow-[2px_0px_0px_0px_var(--border-stark)] md:shadow-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${
            collapsed ? "w-64 md:w-20" : "w-64"
          }`}
        >
          {/* Brand */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/20 shrink-0">
                <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover relative z-10" />
              </div>
              {!collapsed && (
                <span className="font-bold text-xs tracking-wider text-foreground font-mono uppercase">
                  AGENTIC COMMERCE
                </span>
              )}
            </Link>
            <div className="flex items-center gap-1">
              {/* Mobile close */}
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Desktop collapse */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex p-1.5 bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-mono" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-md shadow-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                  }`}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-border bg-card/40">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="truncate font-mono">
                    <div className="text-xs font-semibold text-foreground truncate">{user?.name || "Demo User"}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user?.email || "admin@x402.io"}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Container */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}>
        {/* Header Bar */}
          <header className="h-16 sticky top-0 z-30 bg-background/85 border-b border-border backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open global search"
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-card hover:bg-secondary border border-border rounded-xl text-xs font-mono text-muted-foreground w-36 sm:w-64 md:w-80 transition-all cursor-pointer ml-10 md:ml-0 truncate shrink-0"
            >
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">Search platform...</span>
              <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 bg-secondary border border-border text-[10px] font-mono text-muted-foreground rounded">
                Ctrl K
              </kbd>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <LiveStatus />
              <ThemeToggle />
              <NotificationCenter />
            </div>
          </header>

          {/* Page Body with Sliding Transitions */}
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10 min-w-0 overflow-x-hidden"
              role="main"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
  );
};
