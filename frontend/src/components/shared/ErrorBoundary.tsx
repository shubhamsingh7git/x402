"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Preserved for production error tracking
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground font-sans">
          <div className="max-w-md w-full p-8 glass-card-static rounded-3xl text-center">
            <div className="inline-flex p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl mb-4">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Application Error</h1>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              An unexpected system fault occurred in the x402 Commerce application interface.
            </p>
            {this.state.error && (
              <div className="p-3 bg-muted border border-border rounded-xl text-left font-mono text-[11px] text-destructive mb-6 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
