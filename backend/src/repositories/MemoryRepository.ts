import { AgentMemoryModel, IAgentMemoryDoc } from "../models/AgentMemory.model";

export class MemoryRepository {
  async saveMemory(data: Partial<IAgentMemoryDoc>): Promise<IAgentMemoryDoc> {
    const doc = new AgentMemoryModel(data);
    return doc.save();
  }

  async getSessionMemory(sessionId: string): Promise<IAgentMemoryDoc[]> {
    return AgentMemoryModel.find({ sessionId }).sort({ createdAt: -1 }).exec();
  }

  async getValue(sessionId: string, key: string): Promise<any> {
    const doc = await AgentMemoryModel.findOne({ sessionId, key }).exec();
    return doc?.value;
  }
}

export const memoryRepository = new MemoryRepository();
