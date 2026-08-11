"use client";

import React from "react";
import { X, Code2 } from "lucide-react";
import { CopyButton } from "../ui/CopyButton";
import { Button } from "../ui/button";

interface JsonInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any;
}

export const JsonInspectorModal: React.FC<JsonInspectorModalProps> = ({
  isOpen,
  onClose,
  title = "Raw JSON Inspector",
  data,
}) => {
  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-card-static rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <CopyButton text={jsonString} label="Copy JSON" />
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-foreground bg-background leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
