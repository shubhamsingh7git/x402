import { longTermMemoryRepository } from "../repositories/LongTermMemoryRepository";
import { defaultEmbeddingProvider } from "./DefaultEmbeddingProvider";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class LongTermMemory {
  async recordSemanticMemory(data: {
    title: string;
    content: string;
    memoryType?: string;
    sourceDomain?: string;
    tags?: string[];
  }) {
    const memoryId = `sem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const embedding = await defaultEmbeddingProvider.generateEmbedding(`${data.title} ${data.content}`);

    const mem = await longTermMemoryRepository.saveMemory({
      memoryId,
      title: data.title,
      content: data.content,
      memoryType: data.memoryType || "SEMANTIC",
      sourceDomain: data.sourceDomain || "PLATFORM_INTELLIGENCE",
      confidenceScore: 0.95,
      memoryVersion: 1,
      visibility: "PUBLIC",
      tags: data.tags || [],
      embedding,
    });

    logger.info(`💾 LongTermMemory stored memory [${memoryId}] title: '${data.title}'`);
    eventBus.emitEvent("intelligence:memoryUpdated" as any, mem as any);
    return mem;
  }

  async queryMemories(filter: any = {}, limit = 50) {
    return longTermMemoryRepository.findMemories(filter, limit);
  }
}

export const longTermMemory = new LongTermMemory();
