import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { ProcessingPipeline } from './components/ProcessingPipeline';
import { RiskDashboard } from './components/dashboard/RiskDashboard';
import { Landing } from './components/landing/Landing';
import { AssessmentResult } from './types';
import { LoginPage } from './components/ui/animated-characters-login-page';
import { analyzeContent, fetchHistory } from './lib/api';
import { isLoggedIn, login, register, logout, clearToken } from './lib/auth';

type AppState = 'landing' | 'input' | 'processing' | 'results';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>('landing');
  const [processingStep, setProcessingStep] = useState(-1);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    if (isLoggedIn()) {
      setIsAuthenticated(true);
    }
  }, []);

  // Load history from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory()
        .then(setHistory)
        .catch((err) => {
          // If 401, auto-logout
          if (err.message?.includes('401')) {
            clearToken();
            setIsAuthenticated(false);
          }
          // Otherwise silently fail — history will just be empty
        });
    }
  }, [isAuthenticated]);

  // Processing pipeline animation — runs during real API call
  useEffect(() => {
    if (appState === 'processing') {
      setProcessingStep(0);

      const timer1 = setTimeout(() => setProcessingStep(1), 1500);
      const timer2 = setTimeout(() => setProcessingStep(2), 3500);
      const timer3 = setTimeout(() => setProcessingStep(3), 5500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [appState]);

  const handleAnalysis = async (type: string, content: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAppState('processing');
    const startTime = Date.now();

    try {
      const result = await analyzeContent(type, content);
      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);

      // Ensure the processing animation has had enough time to show
      // Wait at least until step 3 completes (5.5s from start) before showing results
      const minDelay = 6000;
      const elapsed = Date.now() - startTime;
      const remaining = minDelay - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }

      setProcessingStep(4);
      setAppState('results');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
      setAnalysisError(message);
      setAppState('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextSubmit = (text: string) => {
    handleAnalysis('text', text);
  };

  const handleImageSubmit = (file: File) => {
    // Convert file to base64 for the API
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      handleAnalysis('image', base64);
    };
    reader.onerror = () => {
      setAnalysisError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAppState('input');
    setCurrentResult(null);
    setAnalysisError(null);
  };

  /**
   * Handle real login via backend API.
   */
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setIsAuthenticated(true);
  };

  /**
   * Handle real registration via backend API.
   */
  const handleRegister = async (email: string, password: string, username: string) => {
    await register(email, password, username);
    setIsAuthenticated(true);
  };

  /**
   * Handle logout — clear token and reset state.
   */
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setAppState('landing');
    setCurrentResult(null);
    setHistory([]);
    setAnalysisError(null);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  if (appState === 'landing') {
    return (
      <Layout 
        history={history} 
        onSelectHistory={(result) => {
          setCurrentResult(result);
          setAppState('results');
        }}
        onNewAssessment={handleReset}
        onNavigateHome={() => setAppState('landing')}
        onLogout={handleLogout}
      >
        <Landing onStart={() => setAppState('input')} />
      </Layout>
    );
  }

  return (
    <Layout 
      history={history} 
      onSelectHistory={(result) => {
        setCurrentResult(result);
        setAppState('results');
      }}
      onNewAssessment={handleReset}
      onNavigateHome={() => setAppState('landing')}
      onLogout={handleLogout}
    >
      {appState === 'input' && (
        <div className="pt-12 pb-24">
          {analysisError && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-500/10 border border-red-500/20 rounded-lg font-doto uppercase tracking-wider">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {analysisError}
                <button 
                  onClick={() => setAnalysisError(null)} 
                  className="ml-auto text-red-400/60 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <InputSection 
            onSubmitText={handleTextSubmit} 
            onSubmitImage={handleImageSubmit}
            isLoading={isAnalyzing}
          />
        </div>
      )}

      {appState === 'processing' && (
        <div className="pt-24">
          <ProcessingPipeline currentStep={processingStep} />
        </div>
      )}

      {appState === 'results' && currentResult && (
        <div className="pt-6">
          <RiskDashboard result={currentResult} onReset={handleReset} />
        </div>
      )}
    </Layout>
  );
}
