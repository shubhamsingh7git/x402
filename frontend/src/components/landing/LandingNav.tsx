"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

const NAV_LINKS = [
  { label: "FEATURES", href: "#features" },
  { label: "PROTOCOL", href: "#how-it-works" },
  { label: "STATS", href: "#stats" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHash, setActiveHash] = useState("")

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40)

          // Track active section
          const sections = ["features", "how-it-works", "stats"]
          for (const id of sections.reverse()) {
            const el = document.getElementById(id)
            if (el && el.getBoundingClientRect().top < 200) {
              setActiveHash(`#${id}`)
              ticking = false
              return
            }
          }
          setActiveHash("")
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Image src="/logo.jpg" alt="x402 Logo" fill className="object-cover" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-foreground font-mono">
            x402
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-mono font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-foreground transition-colors"
            >
              {link.label}
              {/* Active underline indicator */}
              {activeHash === link.href && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                  layoutId="nav-underline"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button variant="ghost" size="sm" className="font-mono cursor-pointer">
              SIGN IN
            </Button>
          </Link>
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button size="sm" className="font-mono cursor-pointer group">
              LAUNCH APP
              <motion.span
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button size="sm" className="font-mono w-full cursor-pointer">
                  LAUNCH APP →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
