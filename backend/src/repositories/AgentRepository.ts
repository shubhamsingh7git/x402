import { AgentProfileModel, IAgentProfileDoc } from "../models/AgentProfile.model";
import { FilterQuery } from "mongoose";

export class AgentRepository {
  async create(data: Partial<IAgentProfileDoc>): Promise<IAgentProfileDoc> {
    const doc = new AgentProfileModel(data);
    return doc.save();
  }

  async findByAgentId(agentId: string): Promise<IAgentProfileDoc | null> {
    return AgentProfileModel.findOne({ agentId }).exec();
  }

  async updateByAgentId(agentId: string, data: Partial<IAgentProfileDoc>): Promise<IAgentProfileDoc | null> {
    return AgentProfileModel.findOneAndUpdate({ agentId }, { $set: data }, { new: true }).exec();
  }

  async find(filter: FilterQuery<IAgentProfileDoc> = {}, limit = 50): Promise<IAgentProfileDoc[]> {
    return AgentProfileModel.find(filter).sort({ confidenceScore: -1 }).limit(limit).exec();
  }

  async count(filter: FilterQuery<IAgentProfileDoc> = {}): Promise<number> {
    return AgentProfileModel.countDocuments(filter).exec();
  }
}

export const agentRepository = new AgentRepository();
