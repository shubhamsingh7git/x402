"use client";

import React, { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export const LiveStatus: React.FC = () => {
  const [status, setStatus] = useState<"connected" | "reconnecting" | "offline">("offline");

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    if (s.connected) setStatus("connected");

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("offline");
    const onReconnect = () => setStatus("reconnecting");

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.io.on("reconnect_attempt", onReconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.io.off("reconnect_attempt", onReconnect);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-card border border-border rounded-full text-xs font-mono backdrop-blur-md shrink-0"
      role="status"
      aria-live="polite"
    >
      {status === "connected" && (
        <>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Wifi className="w-3 h-3 text-emerald-500 shrink-0" aria-hidden="true" />
          <span className="text-emerald-500 dark:text-emerald-400 font-medium hidden sm:inline">LIVE SOCKET</span>
        </>
      )}
      {status === "reconnecting" && (
        <>
          <RefreshCw className="w-3 h-3 text-amber-500 animate-spin shrink-0" aria-hidden="true" />
          <span className="text-amber-500 dark:text-amber-400 font-medium hidden sm:inline">RECONNECTING...</span>
        </>
      )}
      {status === "offline" && (
        <>
          <span className="h-2 w-2 rounded-full bg-muted-foreground shrink-0"></span>
          <WifiOff className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className="text-muted-foreground font-medium hidden sm:inline">OFFLINE</span>
        </>
      )}
    </div>
  );
};
