import React from "react";

interface SkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({ rows = 5, className = "" }) => {
  return (
    <div className={`space-y-3 w-full animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-muted/60 border border-border/60 rounded-xl w-full" />
      ))}
    </div>
  );
};
