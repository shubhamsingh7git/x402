import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card-static rounded-2xl my-4" role="status">
      <div className="p-4 bg-muted/40 rounded-full text-foreground mb-4 border border-border">
        {icon || <FolderOpen className="w-8 h-8 text-primary" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};
