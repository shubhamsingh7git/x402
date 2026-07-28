"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  LayoutDashboard, Shield, PlayCircle, FileText, Settings, Menu, X
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orchestrator", label: "Orchestrator Pipeline", icon: PlayCircle },
  { href: "/policy", label: "Policy Guard", icon: Shield },
  { href: "/audit", label: "Audit Ledger", icon: FileText },
  { href: "/settings", label: "Infrastructure Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const renderSidebar = (isMobile = false) => {
    const isExpanded = isMobile || !collapsed

    return (
      <div className="w-full flex flex-col h-full overflow-hidden">
        {/* Logo Header */}
        <div className="h-16 flex items-center border-b border-border/40 px-4">
          <Link href="/dashboard" className="flex items-center gap-3.5 group w-full">
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
              <svg viewBox="0 0 32 32" className="w-8 h-8 relative z-10" fill="none">
                <polygon
                  points="16,2 27,7 30,18 27,27 16,30 5,27 2,18 5,7"
                  className="stroke-primary fill-primary/20 transition-all duration-300 group-hover:fill-primary/30"
                  strokeWidth="1.5"
                />
                <line x1="16" y1="2" x2="16" y2="30" className="stroke-primary/80" strokeWidth="1" />
                <line x1="2" y1="16" x2="30" y2="16" className="stroke-primary/80" strokeWidth="1" />
              </svg>
            </div>
            <span
              className={`text-lg font-bold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 transition-all duration-300 ${
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none hidden"
              }`}
            >
              x402<span className="text-muted-foreground font-light">Guard</span>
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isExpanded ? item.label : undefined}
                className={`
                  relative flex items-center gap-3.5 rounded-xl transition-all duration-200 group px-3 py-2.5
                  ${isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}

                <Icon className={`relative z-10 w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'text-primary' : 'group-hover:scale-110'}`} />

                <span
                  className={`relative z-10 text-sm whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none hidden"
                  }`}
                >
                  {item.label}
                </span>

                {/* Hover glow on non-active items */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-muted/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-border/40 bg-background/40 backdrop-blur-md">
          <div className="rounded-xl p-2 flex items-center gap-3 whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-all duration-200 group">
            <div className="relative w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shadow-sm">
              <span>JD</span>
            </div>
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ${
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none hidden"
              }`}
            >
              <div className="text-xs font-semibold truncate group-hover:text-primary transition-colors">Jane Doe</div>
              <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FinOps Admin
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sliding Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col relative border-r border-border/40 bg-background/80 backdrop-blur-xl shrink-0 z-40 overflow-hidden"
        initial={{ width: 72 }}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {renderSidebar(false)}
      </motion.aside>

      {/* Mobile Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed top-3.5 left-3.5 z-50 w-9 h-9 rounded-xl bg-background/80 border border-border/50 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col bg-background border-r border-border/50 z-50 md:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50"
              >
                <X className="w-4 h-4" />
              </button>
              {renderSidebar(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
