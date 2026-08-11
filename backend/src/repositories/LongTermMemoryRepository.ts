import { SemanticMemoryModel, ISemanticMemoryDoc } from "../models/SemanticMemory.model";
import { FilterQuery } from "mongoose";

export class LongTermMemoryRepository {
  async saveMemory(data: Partial<ISemanticMemoryDoc>): Promise<ISemanticMemoryDoc> {
    const doc = new SemanticMemoryModel(data);
    return doc.save();
  }

  async findMemories(filter: FilterQuery<ISemanticMemoryDoc> = {}, limit = 50): Promise<ISemanticMemoryDoc[]> {
    return SemanticMemoryModel.find(filter).sort({ confidenceScore: -1, createdAt: -1 }).limit(limit).exec();
  }

  async countMemories(): Promise<number> {
    return SemanticMemoryModel.countDocuments().exec();
  }
}

export const longTermMemoryRepository = new LongTermMemoryRepository();
