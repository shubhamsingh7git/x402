import { ExecutionSession, IExecutionSession } from "../models/ExecutionSession.model";
import { FilterQuery } from "mongoose";

export class ExecutionRepository {
  async create(data: Partial<IExecutionSession>): Promise<IExecutionSession> {
    const doc = new ExecutionSession(data);
    return doc.save();
  }

  async findBySessionId(sessionId: string): Promise<IExecutionSession | null> {
    return ExecutionSession.findOne({ sessionId }).exec();
  }

  async updateBySessionId(sessionId: string, data: Partial<IExecutionSession>): Promise<IExecutionSession | null> {
    return ExecutionSession.findOneAndUpdate({ sessionId }, { $set: data }, { new: true }).exec();
  }

  async find(filter: FilterQuery<IExecutionSession> = {}, limit = 50): Promise<IExecutionSession[]> {
    return ExecutionSession.find(filter).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: FilterQuery<IExecutionSession> = {}): Promise<number> {
    return ExecutionSession.countDocuments(filter).exec();
  }
}

export const executionRepository = new ExecutionRepository();
