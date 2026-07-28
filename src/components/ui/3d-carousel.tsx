"use client";

import React from "react";
import { Activity, Sparkles } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  telemetryStat?: string;
  customContent?: React.ReactNode;
}

export function Carousel3D({ items }: { items: CarouselItem[] }) {
  // Duplicate items array for seamless 100% infinite HTML/CSS marquee loop
  const doubleItems = [...items, ...items];

  return (
    <div className="w-full max-w-6xl mx-auto py-4 overflow-hidden relative group">
      {/* Pure CSS Fade Gradients on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0D1117] via-[#0D1117]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0D1117] via-[#0D1117]/80 to-transparent z-20 pointer-events-none" />

      {/* Pure HTML & CSS Smooth Marquee Track */}
      <div className="flex w-max gap-6 animate-carousel-scroll group-hover:[animation-play-state:paused] py-4 px-2">
        {doubleItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-[300px] sm:w-[360px] shrink-0 rounded-3xl p-6 sm:p-7 flex flex-col justify-between text-left border border-white/15 bg-black/60 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.02] hover:border-amber-400/50 hover:shadow-[0_12px_40px_rgba(245,158,11,0.2)] select-none relative overflow-hidden group/card"
          >
            {/* Top Row: Icon + Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover/card:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {item.badge && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight text-white group-hover/card:text-amber-300 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Custom Telemetry Content or Stat */}
            <div className="mt-5 pt-3 border-t border-white/10">
              {item.customContent ? (
                item.customContent
              ) : item.telemetryStat ? (
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Telemetry Spec:</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> {item.telemetryStat}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Node Active</span>
                </div>
              )}
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Pure CSS Keyframes Animation embedded inline for maximum compatibility */}
      <style jsx>{`
        @keyframes carousel-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-50% - 12px), 0, 0);
          }
        }
        .animate-carousel-scroll {
          will-change: transform;
          animation: carousel-scroll 32s linear infinite;
        }
      `}</style>
    </div>
  );
}
