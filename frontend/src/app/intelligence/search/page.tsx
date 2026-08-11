"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { intelligenceService } from "@/lib/api/services/intelligenceService";
import { AppLayout } from "@/components/layout/AppLayout";
import { Search, ArrowLeft, Database, Sparkles } from "lucide-react";
import Link from "next/link";
import { SemanticMemoryRecord } from "@/types";

export default function SemanticSearchPage() {
  const [query, setQuery] = useState("financial analysis SLA performance");
  const [searchResults, setSearchResults] = useState<{ query: string; results: { memory: SemanticMemoryRecord; relevanceScore: number }[]; durationMs: number } | null>(null);

  const searchMutation = useMutation({
    mutationFn: (q: string) => intelligenceService.searchSemanticMemory(q),
    onSuccess: (data) => setSearchResults(data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMutation.mutate(query);
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-mono text-xs">
        <Link href="/intelligence" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cognitive Intelligence Control Center</span>
        </Link>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Contextual Natural Language Semantic Search Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            Powered by pluggable vector embedding provider abstraction retrieving relevant memories and organizational context
          </p>
        </div>

        <form onSubmit={handleSearch} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-400" />
            <span>Search Long-Term Memories & Knowledge Graph Context</span>
          </h3>

          <div className="flex items-center gap-4">
            <input
              type="text"
              required
              placeholder="e.g. financial analysis latency SLA"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans text-xs"
            />
            <button
              type="submit"
              disabled={searchMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-purple-500/20 shrink-0"
            >
              {searchMutation.isPending ? "Retrieving..." : "Semantic Search"}
            </button>
          </div>
        </form>

        {searchResults && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm font-sans">
                Search Results for &quot;{searchResults.query}&quot;
              </h3>
              <div className="text-slate-400 text-xs">
                Retrieved in <strong className="text-purple-400">{searchResults.durationMs} ms</strong>
              </div>
            </div>

            <div className="space-y-3">
              {searchResults.results.map((r, idx) => (
                <div key={r.memory.memoryId || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-400">#{(r.relevanceScore * 100).toFixed(0)}% Match</span>
                      <span className="font-bold text-white font-sans text-sm">{r.memory.title}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 text-cyan-400 text-[10px] rounded border border-slate-800">
                      {r.memory.memoryType}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs font-sans p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                    {r.memory.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
