export enum AgentStatusEnum {
  IDLE = "IDLE",
  BUSY = "BUSY",
  ROUTING = "ROUTING",
  REASONING = "REASONING",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  OFFLINE = "OFFLINE",
  MAINTENANCE = "MAINTENANCE",
}

export type AgentStatus = keyof typeof AgentStatusEnum;
