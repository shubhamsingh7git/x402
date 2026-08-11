import { agentRepository } from "../repositories/AgentRepository";
import { AgentStatusEnum } from "./AgentStatus";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class AgentRegistry {
  async registerAgent(data: any) {
    const agentId = data.agentId || `ag_${data.role.toLowerCase()}_${Math.random().toString(36).substring(2, 6)}`;
    const agent = await agentRepository.create({
      ...data,
      agentId,
      status: AgentStatusEnum.IDLE,
    });

    logger.info(`🤖 AgentRegistry registered agent [${agentId}] role: '${agent.role}'`);
    eventBus.emitEvent("agent:registered" as any, agent as any);
    return agent;
  }

  async findAgentsByCapability(capability: string) {
    return agentRepository.find({ capabilities: { $in: [capability] } });
  }

  async getAllAgents() {
    return agentRepository.find({}, 100);
  }

  async updateAgentStatus(agentId: string, status: AgentStatusEnum) {
    return agentRepository.updateByAgentId(agentId, { status });
  }
}

export const agentRegistry = new AgentRegistry();
