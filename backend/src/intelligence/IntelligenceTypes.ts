import { IntelligenceStateEnum } from "./IntelligenceState";

export type RecommendationCategory = "OPERATIONAL" | "COST" | "QUALITY" | "SECURITY" | "GOVERNANCE" | "MARKETPLACE";

export interface IKnowledgeNodeDTO {
  id?: string;
  nodeId: string;
  nodeType: "PROVIDER" | "CAPABILITY" | "AGENT" | "USER" | "POLICY" | "EXECUTION" | "ORGANIZATION";
  label: string;
  properties: Record<string, unknown>;
  createdAt?: string | Date;
}

export interface IKnowledgeEdgeDTO {
  id?: string;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: "OFFERS_CAPABILITY" | "USES_PROVIDER" | "ENFORCES_POLICY" | "DEPENDS_ON" | "ROUTED_TO";
  weight: number; // 0.0 to 1.0
  version: number;
  createdAt?: string | Date;
}

export interface ISemanticMemoryDTO {
  id?: string;
  memoryId: string;
  memoryType: "SEMANTIC" | "EPISODIC" | "PROCEDURAL" | "ORGANIZATIONAL";
  title: string;
  content: string;
  confidenceScore: number;
  memoryVersion: number;
  sourceDomain: string;
  visibility: "PUBLIC" | "RESTRICTED";
  expirationDate?: string | Date;
  tags: string[];
  createdAt?: string | Date;
}

export interface IOptimizationRecommendationDTO {
  id?: string;
  recommendationId: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  targetEntityId: string;
  targetEntityType: string;
  impactScore: number; // 1 to 100
  estimatedSavingsUsd?: number;
  status: "RECOMMENDING" | "WAITING_APPROVAL" | "APPLIED" | "ARCHIVED";
  proposedConfig: Record<string, unknown>;
  createdAt?: string | Date;
}

export interface IIntelligenceAnalyticsDTO {
  knowledgeNodeCount: number;
  knowledgeEdgeCount: number;
  totalSemanticMemories: number;
  optimizationRecommendationsCount: number;
  learningAccuracy: number; // percentage 0-100
  semanticSearchLatencyMs: number;
  memoryGrowthRate: number;
  topCategories: { category: string; count: number }[];
}
