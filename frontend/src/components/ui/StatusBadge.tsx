import React from "react";
import { STATUS_COLORS } from "@/constants/status";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const config = STATUS_COLORS[status] || {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    dot: "bg-slate-400",
  };

  return (
    <span
      role="status"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border rounded-full backdrop-blur-md transition-all ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};
