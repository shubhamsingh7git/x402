import { agentRegistry } from "./AgentRegistry";
import { logger } from "../utils/logger";

export class AgentRouter {
  async routeTask(capability: string) {
    const candidates = await agentRegistry.findAgentsByCapability(capability);

    if (candidates.length === 0) {
      logger.warn(`⚠️ AgentRouter: No specific agent candidate for capability '${capability}' — using General ReasoningAgent`);
      const allAgents = await agentRegistry.getAllAgents();
      return allAgents[0] || null;
    }

    // Sort by highest confidence score
    candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
    const selected = candidates[0];

    logger.info(`🔀 AgentRouter routed capability '${capability}' → Agent [${selected.agentId}] (${selected.agentName})`);
    return selected;
  }
}

export const agentRouter = new AgentRouter();
