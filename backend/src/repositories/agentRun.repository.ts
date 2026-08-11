import { AgentRun, IAgentRunDocument } from "../models/AgentRun";

export class AgentRunRepository {
  async create(data: Partial<IAgentRunDocument>): Promise<IAgentRunDocument> {
    return AgentRun.create(data);
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ data: IAgentRunDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      AgentRun.find(filter).sort(sort).skip(skip).limit(limit),
      AgentRun.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IAgentRunDocument | null> {
    return AgentRun.findById(id);
  }

  async updateById(id: string, data: Partial<IAgentRunDocument>): Promise<IAgentRunDocument | null> {
    return AgentRun.findByIdAndUpdate(id, data, { new: true });
  }

  async countByStatus(status: string): Promise<number> {
    return AgentRun.countDocuments({ status });
  }

  async countAll(): Promise<number> {
    return AgentRun.countDocuments();
  }
}

export const agentRunRepository = new AgentRunRepository();
