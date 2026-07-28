import { AssessmentResult, EvidenceSignal, AgentLog } from '../types';
import { getAuthHeaders, clearToken } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface AnalyzeApiResponse {
  id: string;
  timestamp: string;
  inputType: string;
  contentPreview: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  riskType: string;
  uncertaintyLevel: 'Low' | 'Medium' | 'High';
  decision: 'Allow' | 'Warn User' | 'Flag for Review' | 'Human Required';
  decisionExplanation: string;
  suggestedAction: string;
  evidence: EvidenceSignal[];
  logs: AgentLog[];
}

interface HistoryApiResponse {
  analyses: AnalyzeApiResponse[];
  total: number;
}

/**
 * Convert API response to frontend AssessmentResult type.
 */
function toAssessmentResult(data: AnalyzeApiResponse): AssessmentResult {
  return {
    id: data.id,
    timestamp: new Date(data.timestamp),
    inputType: data.inputType as AssessmentResult['inputType'],
    contentPreview: data.contentPreview,
    riskScore: data.riskScore,
    riskLevel: data.riskLevel,
    riskType: data.riskType,
    uncertaintyLevel: data.uncertaintyLevel,
    decision: data.decision,
    decisionExplanation: data.decisionExplanation,
    suggestedAction: data.suggestedAction,
    evidence: data.evidence,
    logs: data.logs,
  };
}

/**
 * Handle 401 responses — auto-logout on token expiry.
 */
function handleAuthError(response: Response): void {
  if (response.status === 401) {
    clearToken();
  }
}

/**
 * Submit content for risk analysis.
 */
export async function analyzeContent(
  type: string,
  content: string
): Promise<AssessmentResult> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ type, content }),
  });

  if (!response.ok) {
    handleAuthError(response);
    const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(error.detail || `Analysis failed (${response.status})`);
  }

  const data: AnalyzeApiResponse = await response.json();
  return toAssessmentResult(data);
}

/**
 * Fetch analysis history from the backend.
 */
export async function fetchHistory(
  limit: number = 20,
  offset: number = 0
): Promise<AssessmentResult[]> {
  const response = await fetch(
    `${API_BASE}/api/history?limit=${limit}&offset=${offset}`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!response.ok) {
    handleAuthError(response);
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch history' }));
    throw new Error(error.detail || `Failed to fetch history (${response.status})`);
  }

  const data: HistoryApiResponse = await response.json();
  return data.analyses.map(toAssessmentResult);
}

/**
 * Submit user feedback for an analysis.
 */
export async function submitFeedback(
  analysisId: string,
  helpful: boolean,
  comment?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      analysis_id: analysisId,
      helpful,
      comment: comment || null,
    }),
  });

  if (!response.ok) {
    handleAuthError(response);
    const error = await response.json().catch(() => ({ detail: 'Failed to submit feedback' }));
    throw new Error(error.detail || `Failed to submit feedback (${response.status})`);
  }
}

/**
 * Check if the backend is reachable.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
