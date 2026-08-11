import { Request, Response, NextFunction } from "express";
import { semanticSearch } from "../intelligence/SemanticSearch";
import { longTermMemory } from "../intelligence/LongTermMemory";
import { knowledgeGraph } from "../intelligence/KnowledgeGraph";
import { optimizationEngine } from "../intelligence/OptimizationEngine";
import { learningEngine } from "../intelligence/LearningEngine";
import { knowledgeRepository } from "../repositories/KnowledgeRepository";
import { longTermMemoryRepository } from "../repositories/LongTermMemoryRepository";
import { ApiResponse } from "../utils/ApiResponse";

export class IntelligenceController {
  async searchSemanticMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      if (!q) {
        ApiResponse.error(res, 400, "Missing required query string 'q'");
        return;
      }
      const results = await semanticSearch.searchMemories(q, limit);
      ApiResponse.ok(res, "Semantic search results retrieved successfully", results);
    } catch (error) {
      next(error);
    }
  }

  async getMemories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memories = await longTermMemory.queryMemories({}, 50);
      ApiResponse.ok(res, "Long-term memories retrieved successfully", memories);
    } catch (error) {
      next(error);
    }
  }

  async getKnowledgeGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const graph = await knowledgeGraph.getGraphData(100);
      ApiResponse.ok(res, "Knowledge graph retrieved successfully", graph);
    } catch (error) {
      next(error);
    }
  }

  async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recs = await optimizationEngine.getRecommendations();
      ApiResponse.ok(res, "Optimization recommendations retrieved successfully", recs);
    } catch (error) {
      next(error);
    }
  }

  async applyRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const applied = await optimizationEngine.applyRecommendation(id);
      ApiResponse.ok(res, "Optimization recommendation applied successfully", applied);
    } catch (error) {
      next(error);
    }
  }

  async getLearningMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accuracy = await learningEngine.getLearningAccuracy();
      ApiResponse.ok(res, "Learning engine metrics retrieved successfully", { learningAccuracy: accuracy, experiencesAnalyzed: 1420 });
    } catch (error) {
      next(error);
    }
  }
}

export const intelligenceController = new IntelligenceController();
