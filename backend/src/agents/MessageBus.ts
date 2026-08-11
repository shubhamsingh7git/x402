import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export interface AgentMessage {
  messageId: string;
  correlationId: string;
  type: "REQUEST" | "RESPONSE" | "EVENT" | "BROADCAST" | "CONSENSUS";
  senderAgentId: string;
  targetAgentId?: string;
  payload: any;
  timestamp: Date;
}

export class MessageBus {
  async publish(msg: Omit<AgentMessage, "messageId" | "timestamp">) {
    const fullMsg: AgentMessage = {
      ...msg,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date(),
    };

    logger.debug(`💬 MessageBus published [${fullMsg.type}] from [${fullMsg.senderAgentId}] (Correlation: ${fullMsg.correlationId})`);
    eventBus.emitEvent("agent:routed" as any, fullMsg as any);
    return fullMsg;
  }
}

export const messageBus = new MessageBus();
