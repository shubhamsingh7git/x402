import { memoryRepository } from "../repositories/MemoryRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class MemoryManager {
  async writeMemory(sessionId: string, sourceAgentId: string, key: string, value: any, tags: string[] = []) {
    const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const mem = await memoryRepository.saveMemory({
      memoryId,
      sessionId,
      sourceAgentId,
      key,
      value,
      tags,
    });

    logger.info(`🧠 MemoryManager saved key '${key}' for session [${sessionId}] by Agent [${sourceAgentId}]`);
    eventBus.emitEvent("agent:memoryUpdated" as any, mem as any);
    return mem;
  }

  async readSessionMemory(sessionId: string) {
    return memoryRepository.getSessionMemory(sessionId);
  }
}

export const memoryManager = new MemoryManager();
