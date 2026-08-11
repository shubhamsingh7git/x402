"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

export const NotificationCenter: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    // Delay to avoid triggering on the same click that opens
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-background hover:bg-muted border border-border text-foreground rounded-xl transition-all shadow-xs cursor-pointer"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold font-mono text-primary-foreground shadow-md" aria-hidden="true">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 glass-card-static rounded-2xl z-50 overflow-hidden animate-in fade-in duration-150"
          role="menu"
          aria-label="Notification list"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-mono rounded-full border border-primary/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllAsRead}
                className="p-1 text-muted-foreground hover:text-primary text-xs font-mono transition-colors cursor-pointer"
                title="Mark all as read"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={clearAll}
                className="p-1 text-muted-foreground hover:text-destructive text-xs font-mono transition-colors cursor-pointer"
                title="Clear all"
                aria-label="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground font-mono" role="status">No notifications recorded yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  role="menuitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      markAsRead(n.id);
                    }
                  }}
                  className={`p-3 text-xs font-mono transition-colors cursor-pointer ${
                    n.read ? "bg-muted/20 opacity-75" : "bg-muted/50 border-l-2 border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{n.category}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-semibold text-foreground mb-0.5">{n.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug">{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});
