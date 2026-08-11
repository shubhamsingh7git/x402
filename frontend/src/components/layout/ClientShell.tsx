"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { TopNav } from "@/components/layout/TopNav"
import { OctagonBackground } from "@/components/premium/OctagonBackground"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PreloaderOverlay } from "@/components/animation/PreloaderOverlay"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forbidden" || pathname === "/unauthorized"

  return (
    <TooltipProvider>
      <PreloaderOverlay>
        <div className="flex h-screen overflow-hidden relative">
          <OctagonBackground />
          {!isAuthPage && <Sidebar />}
          <div className="flex-1 flex flex-col min-w-0 relative z-10">
            {!isAuthPage && <TopNav />}
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex-1 ${isAuthPage ? "overflow-y-auto w-full" : "overflow-auto"}`}
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </PreloaderOverlay>
    </TooltipProvider>
  )
}
