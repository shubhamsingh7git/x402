import { optimizationRepository } from "../repositories/OptimizationRepository";
import { RecommendationCategory } from "./IntelligenceTypes";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class OptimizationEngine {
  async generateRecommendation(data: {
    category: RecommendationCategory;
    title: string;
    description: string;
    targetEntityId: string;
    targetEntityType: string;
    impactScore?: number;
    estimatedSavingsUsd?: number;
    proposedConfig?: Record<string, unknown>;
  }) {
    const recommendationId = `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rec = await optimizationRepository.create({
      ...data,
      recommendationId,
      status: "RECOMMENDING",
      impactScore: data.impactScore || 85,
      proposedConfig: data.proposedConfig as any,
    });

    logger.info(`🚀 OptimizationEngine created recommendation [${recommendationId}] category: '${data.category}'`);
    eventBus.emitEvent("intelligence:recommendationCreated" as any, rec as any);
    return rec;
  }

  async applyRecommendation(recommendationId: string) {
    const rec = await optimizationRepository.updateStatus(recommendationId, "APPLIED");
    if (!rec) throw new Error(`Recommendation '${recommendationId}' not found`);

    logger.info(`✅ OptimizationEngine applied recommendation [${recommendationId}]`);
    eventBus.emitEvent("intelligence:optimizationGenerated" as any, rec as any);
    return rec;
  }

  async getRecommendations() {
    return optimizationRepository.find(50);
  }
}

export const optimizationEngine = new OptimizationEngine();
