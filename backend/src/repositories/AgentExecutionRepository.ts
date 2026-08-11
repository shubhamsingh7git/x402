import { AgentExecutionSessionModel, IAgentExecutionSessionDoc } from "../models/AgentExecutionSession.model";

export class AgentExecutionRepository {
  async create(data: Partial<IAgentExecutionSessionDoc>): Promise<IAgentExecutionSessionDoc> {
    const doc = new AgentExecutionSessionModel(data);
    return doc.save();
  }

  async findBySessionId(sessionId: string): Promise<IAgentExecutionSessionDoc | null> {
    return AgentExecutionSessionModel.findOne({ sessionId }).exec();
  }

  async updateBySessionId(sessionId: string, data: Partial<IAgentExecutionSessionDoc>): Promise<IAgentExecutionSessionDoc | null> {
    return AgentExecutionSessionModel.findOneAndUpdate({ sessionId }, { $set: data }, { new: true }).exec();
  }

  async find(limit = 50): Promise<IAgentExecutionSessionDoc[]> {
    return AgentExecutionSessionModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return AgentExecutionSessionModel.countDocuments(filter).exec();
  }
}

export const agentExecutionRepository = new AgentExecutionRepository();
