"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Building2, CreditCard, Bot, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickNav = [
  { title: "Dashboard", href: ROUTES.DASHBOARD, icon: <Bot className="w-4 h-4 text-primary" /> },
  { title: "Merchants", href: ROUTES.MERCHANTS.LIST, icon: <Building2 className="w-4 h-4 text-emerald-500" /> },
  { title: "Transactions", href: ROUTES.TRANSACTIONS.LIST, icon: <CreditCard className="w-4 h-4 text-purple-500" /> },
  { title: "Policies", href: ROUTES.POLICIES, icon: <ShieldCheck className="w-4 h-4 text-amber-500" /> },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = React.memo(({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="relative w-full max-w-2xl glass-card-static rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/40">
          <Search className="w-5 h-5 text-primary" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchants, transactions, research runs, policies..."
            className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none font-mono"
            aria-label="Search the platform"
          />
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Navigation</div>
            <div className="grid grid-cols-2 gap-2" role="list">
              {quickNav.map((nav, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(nav.href)}
                  role="listitem"
                  className="flex items-center justify-between p-3 bg-background hover:bg-muted border border-border rounded-xl text-xs text-foreground transition-all font-mono group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {nav.icon}
                    <span>{nav.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-muted/30 border-t border-border text-[11px] font-mono text-muted-foreground flex justify-between">
          <span>Press ESC or click outside to close</span>
          <span>x402 Global Search</span>
        </div>
      </div>
    </div>
  );
});
