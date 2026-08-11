"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { distributedService } from "@/lib/api/services/distributedService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SchedulerPage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["distributed", "scheduler", "all"],
    queryFn: distributedService.getSchedulerTasks,
  });

  const taskList = tasks || [];

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/distributed" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Distributed Infrastructure</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Cron & Recurring Background Task Scheduler</h1>
          </div>
          <p className="text-xs text-slate-400">
            Cron expressions, recurring background learning, and platform maintenance tasks
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Scheduled Recurring Tasks ({taskList.length})</span>
          </h3>

          <div className="space-y-3">
            {taskList.map((t) => (
              <div key={t.taskId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white font-sans text-sm">{t.taskName}</div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded">
                    Cron: {t.cronExpression}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">ID: {t.taskId} • Target Queue: {t.targetQueue} • Category: {t.jobCategory}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
