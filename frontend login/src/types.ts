export type RiskLevel = 'low' | 'moderate' | 'high';

export interface EvidenceSignal {
  id: string;
  label: string;
  confidence: number; // 0 to 100
  level: RiskLevel;
  explanation: string;
}

export interface AgentLog {
  agentName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: Date;
  inputType: 'text' | 'image' | 'speech' | 'video' | 'audio';
  contentPreview: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  riskType: string;
  uncertaintyLevel: 'Low' | 'Medium' | 'High';
  decision: 'Allow' | 'Warn User' | 'Flag for Review' | 'Human Required';
  decisionExplanation: string;
  suggestedAction: string;
  evidence: EvidenceSignal[];
  logs: AgentLog[];
}
