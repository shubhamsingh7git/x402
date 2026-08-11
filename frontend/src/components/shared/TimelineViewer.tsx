"use client";

import React from "react";
import { TimelineEvent } from "@/types";
import { CheckCircle2, Clock, XCircle, CreditCard, ShieldCheck, Zap, Bot, Eye } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";

interface TimelineViewerProps {
  events: TimelineEvent[];
  onInspectMetadata?: (metadata: any) => void;
  className?: string;
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({ events, onInspectMetadata, className = "" }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground glass-card-static rounded-xl">
        No execution timeline events recorded yet.
      </div>
    );
  }

  const getEventIcon = (event: string) => {
    if (event.includes("PAYMENT")) return <CreditCard className="w-4 h-4 text-primary" />;
    if (event.includes("VERIFICATION") || event.includes("POLICY")) return <ShieldCheck className="w-4 h-4 text-purple-500" />;
    if (event.includes("COMPLETED") || event.includes("APPROVED")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (event.includes("FAILED") || event.includes("DENIED")) return <XCircle className="w-4 h-4 text-rose-500" />;
    if (event.includes("STEP") || event.includes("PLAN")) return <Bot className="w-4 h-4 text-amber-500" />;
    return <Zap className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((ev, index) => (
        <div key={ev._id || index} className="relative flex items-start gap-4 group">
          {/* Connector Line */}
          {index < events.length - 1 && (
            <div className="absolute left-[17px] top-8 bottom-0 w-0.5 bg-border group-hover:bg-primary/50 transition-colors" />
          )}

          {/* Icon Badge */}
          <div className="p-2 bg-background border border-border rounded-xl shadow-xs z-10">
            {getEventIcon(ev.event)}
          </div>

          {/* Event Content */}
          <div className="flex-1 glass-card-static rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground font-mono">{ev.event}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
                {ev.metadata && onInspectMetadata && (
                  <button
                    onClick={() => onInspectMetadata(ev.metadata)}
                    className="p-1 hover:bg-muted text-muted-foreground hover:text-primary rounded transition-colors cursor-pointer"
                    title="View metadata JSON"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {ev.stepId !== undefined && (
              <div className="text-[11px] font-mono text-primary font-medium mt-1">Step #{ev.stepId}</div>
            )}

            {ev.metadata && (
              <div className="mt-2 text-xs font-mono text-foreground bg-background p-2 rounded-lg border border-border">
                {Object.entries(ev.metadata).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="text-foreground truncate max-w-[200px]">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
