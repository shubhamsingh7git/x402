export const AGENT_EVENTS = {
  REGISTERED: "agent:registered",
  STARTED: "agent:started",
  COMPLETED: "agent:completed",
  FAILED: "agent:failed",
  ROUTED: "agent:routed",
  MEMORY_UPDATED: "agent:memoryUpdated",
  CONSENSUS_STARTED: "agent:consensusStarted",
  CONSENSUS_COMPLETED: "agent:consensusCompleted",
  APPROVAL_REQUESTED: "approval:requested",
  APPROVAL_APPROVED: "approval:approved",
  APPROVAL_REJECTED: "approval:rejected",
  GOVERNANCE_EVALUATED: "governance:evaluated",
} as const;
