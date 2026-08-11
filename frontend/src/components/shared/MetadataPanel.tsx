import React from "react";
import { CopyButton } from "../ui/CopyButton";

interface MetadataField {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  copyText?: string;
}

interface MetadataPanelProps {
  title?: string;
  fields: MetadataField[];
  className?: string;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ title = "Metadata", fields, className = "" }) => {
  return (
    <div className={`p-6 glass-card-static rounded-2xl ${className}`}>
      {title && <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, idx) => (
          <div key={idx} className="p-3 bg-background border border-border rounded-xl shadow-xs">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{field.label}</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-mono text-foreground truncate">{field.value}</div>
              {field.copyable && field.copyText && <CopyButton text={field.copyText} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
