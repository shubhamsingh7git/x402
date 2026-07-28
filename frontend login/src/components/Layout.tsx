import React, { useState } from 'react';
import { Shield, History, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssessmentResult } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  history: AssessmentResult[];
  onSelectHistory: (result: AssessmentResult) => void;
  onNewAssessment: () => void;
  onNavigateHome: () => void;
  onLogout?: () => void;
}

export function Layout({ children, history, onSelectHistory, onNewAssessment, onNavigateHome, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel !rounded-none border-t-0 border-x-0 border-b border-white/10 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DARE</h1>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">Digital Authenticity Risk Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button onClick={onNavigateHome} className="hover:text-zinc-200 transition-colors">Home</button>
            <button onClick={onNewAssessment} className="hover:text-zinc-200 transition-colors">Dashboard</button>
            <a href="#" className="hover:text-zinc-200 transition-colors">Docs</a>
          </nav>
          
          <div className="w-px h-6 bg-white/10 hidden md:block" />

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-zinc-300"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>

          {onLogout && (
            <>
              <div className="w-px h-6 bg-white/10" />
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-0 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* History Sidebar */}
        <div className={cn(
          "fixed inset-y-0 right-0 w-80 glass-panel !rounded-none border-y-0 border-r-0 border-l border-white/10 transform transition-transform duration-300 ease-in-out z-40 flex flex-col bg-background/95 backdrop-blur-xl",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between mt-16 sm:mt-0">
            <h2 className="font-semibold flex items-center gap-2">
              <History className="w-4 h-4" />
              Assessment History
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center mt-8">No previous assessments</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      item.riskLevel === 'low' ? "bg-emerald-500/10 text-emerald-400" :
                      item.riskLevel === 'moderate' ? "bg-amber-500/10 text-amber-400" :
                      "bg-rose-500/10 text-rose-400"
                    )}>
                      {item.riskScore}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate text-zinc-200">
                    {item.contentPreview}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {item.riskType}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 sm:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
