import { longTermMemoryRepository } from "../repositories/LongTermMemoryRepository";
import { defaultEmbeddingProvider } from "./DefaultEmbeddingProvider";
import { logger } from "../utils/logger";

export class SemanticSearch {
  async searchMemories(query: string, limit = 10) {
    const startTime = Date.now();
    const queryVec = await defaultEmbeddingProvider.generateEmbedding(query);
    const allMemories = await longTermMemoryRepository.findMemories({}, 100);

    const scored = allMemories.map((m) => {
      const sim = defaultEmbeddingProvider.calculateSimilarity(queryVec, m.embedding || []);
      return {
        memory: m,
        relevanceScore: sim,
      };
    });

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const durationMs = Date.now() - startTime;

    logger.info(`🔍 SemanticSearch retrieved ${scored.length} results for query '${query}' in ${durationMs}ms`);
    return {
      query,
      results: scored.slice(0, limit),
      durationMs,
    };
  }
}

export const semanticSearch = new SemanticSearch();
