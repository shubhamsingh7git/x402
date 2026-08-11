"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 glass-card-static rounded-3xl text-center">
        <div className="inline-flex p-4 bg-primary/10 border border-primary/30 text-primary rounded-2xl mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">404 — Page Not Found</h1>
        <p className="text-xs text-muted-foreground font-mono mb-6 leading-relaxed">
          The requested page route does not exist in the x402 Commerce Platform.
        </p>
        <Link href={ROUTES.DASHBOARD}>
          <Button size="lg" className="w-full font-mono text-xs gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
