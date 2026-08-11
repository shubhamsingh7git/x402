"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["distributed", "events", "all"],
    queryFn: distributedService.getEvents,
  });

  const eventList = events || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-pink-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Distributed Event Bus Stream</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time cross-domain event publications stream across all platform bounded contexts
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Radio className="w-4 h-4 text-pink-400" />
            <span>Event Bus Journal ({eventList.length})</span>
          </h3>

          <div className="space-y-3">
            {eventList.map((e) => (
              <div key={e.eventId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{e.domain}:{e.eventName}</span>
                    <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 font-bold text-[10px] rounded font-mono">
                      ID: {e.eventId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(e.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
