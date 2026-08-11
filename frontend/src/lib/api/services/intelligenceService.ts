import { apiClient } from "../axios";
import {
  ApiResponse,
  KnowledgeNodeRecord,
  KnowledgeEdgeRecord,
  SemanticMemoryRecord,
  OptimizationRecommendationRecord,
  IntelligenceAnalyticsRecord,
} from "@/types";

export const intelligenceService = {
  searchSemanticMemory: async (q: string, limit = 10): Promise<{ query: string; results: { memory: SemanticMemoryRecord; relevanceScore: number }[]; durationMs: number }> => {
    const res = await apiClient.get<ApiResponse<any>>("/intelligence/search", { params: { q, limit } });
    return res.data?.data || res.data;
  },

  getMemories: async (): Promise<SemanticMemoryRecord[]> => {
    const res = await apiClient.get<ApiResponse<SemanticMemoryRecord[]>>("/intelligence/memory");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  getKnowledgeGraph: async (): Promise<{ nodes: KnowledgeNodeRecord[]; edges: KnowledgeEdgeRecord[] }> => {
    const res = await apiClient.get<ApiResponse<{ nodes: KnowledgeNodeRecord[]; edges: KnowledgeEdgeRecord[] }>>("/intelligence/knowledge");
    return res.data?.data || res.data || { nodes: [], edges: [] };
  },

  getRecommendations: async (): Promise<OptimizationRecommendationRecord[]> => {
    const res = await apiClient.get<ApiResponse<OptimizationRecommendationRecord[]>>("/intelligence/recommendations");
    const payload = res.data;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  },

  applyRecommendation: async (id: string): Promise<OptimizationRecommendationRecord> => {
    const res = await apiClient.post<ApiResponse<OptimizationRecommendationRecord>>(`/intelligence/recommendations/${id}/apply`);
    return res.data?.data || res.data;
  },

  getLearningMetrics: async (): Promise<{ learningAccuracy: number; experiencesAnalyzed: number }> => {
    const res = await apiClient.get<ApiResponse<{ learningAccuracy: number; experiencesAnalyzed: number }>>("/intelligence/learning");
    return res.data?.data || res.data;
  },
};
