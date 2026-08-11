import { agentRunRepository } from "../../repositories/agentRun.repository";
import { ApiError } from "../../utils/ApiError";
import { ParsedQueryParams, PaginatedResult } from "../../utils/query.util";
import { IAgentRun } from "../../interfaces/agent.interface";

export class AgentRunService {
  async getAgentRuns(params: ParsedQueryParams): Promise<PaginatedResult<IAgentRun>> {
    const { data, total } = await agentRunRepository.findPaginated(
      params.filter,
      params.skip,
      params.limit,
      params.sort
    );
    const pages = Math.ceil(total / params.limit) || 1;
    return {
      data: data as unknown as IAgentRun[],
      pagination: { total, page: params.page, limit: params.limit, pages },
    };
  }

  async getAgentRunById(id: string): Promise<IAgentRun> {
    const run = await agentRunRepository.findById(id);
    if (!run) {
      throw ApiError.notFound("Agent run not found");
    }
    return run as unknown as IAgentRun;
  }
}

export const agentRunService = new AgentRunService();
