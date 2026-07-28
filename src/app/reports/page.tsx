"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReportsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/audit")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <span className="text-xs text-muted-foreground font-mono animate-pulse">
        Redirecting to Audit Ledger...
      </span>
    </div>
  )
}
