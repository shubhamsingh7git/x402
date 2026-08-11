import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "../ui/StatusBadge";

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  status?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  status,
  backHref,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card-static rounded-2xl mb-6">
      <div className="flex items-center gap-4">
        {backHref && (
          <Link
            href={backHref}
            className="p-2 bg-background hover:bg-muted text-foreground rounded-xl border border-border transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
            {status && <StatusBadge status={status} />}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground font-mono mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
