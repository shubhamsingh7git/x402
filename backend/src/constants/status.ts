export const AGENT_STATUS = {
  QUEUED: "queued",
  PLANNING: "planning",
  EXECUTING: "executing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
  FAILED: "FAILED",
  SETTLED: "SETTLED",
} as const;

export const MERCHANT_STATUS = {
  PENDING: "Pending",
  VERIFYING: "Verifying",
  VERIFIED: "Verified",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
  DELETED: "Deleted",
} as const;

export const POLICY_DECISION = {
  APPROVED: "Approved",
  DENIED: "Denied",
} as const;

export const PAYMENT_SCHEME = {
  EXACT: "Exact",
  UPTO: "Upto",
  BATCH: "Batch",
} as const;

export type AgentStatus = (typeof AGENT_STATUS)[keyof typeof AGENT_STATUS];
export type TransactionStatus = (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
export type MerchantStatus = (typeof MERCHANT_STATUS)[keyof typeof MERCHANT_STATUS];
export type PolicyDecision = (typeof POLICY_DECISION)[keyof typeof POLICY_DECISION];
export type PaymentScheme = (typeof PAYMENT_SCHEME)[keyof typeof PAYMENT_SCHEME];
