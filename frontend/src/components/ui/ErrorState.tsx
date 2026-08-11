import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "An error occurred while fetching information from the backend.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 border border-destructive/30 rounded-2xl backdrop-blur-md my-4">
      <div className="p-3 bg-destructive/15 rounded-full text-destructive mb-3 border border-destructive/30">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="destructive"
          size="sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </Button>
      )}
    </div>
  );
};
