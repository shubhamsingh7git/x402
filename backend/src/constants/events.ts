/** Socket.IO & EventBus event names */
export const EVENTS = {
  // Agent execution lifecycle
  RESEARCH_STARTED: "research:started",
  PLAN_STARTED: "plan:started",
  PLAN_GENERATED: "plan:generated",
  STEP_STARTED: "step:started",
  STEP_RUNNING: "step:running",
  STEP_COMPLETED: "step:completed",
  STEP_FAILED: "step:failed",
  TIMELINE_UPDATE: "timeline:update",
  RESEARCH_COMPLETED: "research:completed",
  RESEARCH_ERROR: "research:error",

  // Payment lifecycle (Milestone 4)
  PAYMENT_CREATED: "payment:created",
  PAYMENT_VALIDATED: "payment:validated",
  PAYMENT_POLICY_CHECK: "payment:policyCheck",
  PAYMENT_REQUESTED: "payment:requested",
  PAYMENT_APPROVED: "payment:approved",
  PAYMENT_DENIED: "payment:denied",
  PAYMENT_PREPARING: "payment:preparing",
  PAYMENT_PROCESSING: "payment:processing",
  PAYMENT_SETTLED: "payment:settled",
  PAYMENT_COMPLETED: "payment:completed",
  PAYMENT_FAILED: "payment:failed",
  PAYMENT_CANCELLED: "payment:cancelled",

  // Policy events
  POLICY_UPDATED: "policy:updated",
  POLICY_VIOLATION: "policy:violation",
  KILL_SWITCH_TOGGLED: "policy:killSwitch",

  // Merchant Verification events (RC1.1)
  MERCHANT_VERIFICATION_STARTED: "merchant:verificationStarted",
  MERCHANT_VERIFICATION_SUCCEEDED: "merchant:verificationSucceeded",
  MERCHANT_VERIFICATION_FAILED: "merchant:verificationFailed",
  MERCHANT_STATUS_CHANGED: "merchant:statusChanged",

  // Audit
  AUDIT_LOG_CREATED: "audit:logCreated",

  // Dashboard
  DASHBOARD_REFRESH: "dashboard:refresh",
} as const;

export const TIMELINE_EVENTS = {
  RUN_CREATED: "RUN_CREATED",
  PLAN_STARTED: "PLAN_STARTED",
  PLAN_COMPLETED: "PLAN_COMPLETED",
  STEP_STARTED: "STEP_STARTED",
  STEP_COMPLETED: "STEP_COMPLETED",
  STEP_FAILED: "STEP_FAILED",
  RUN_COMPLETED: "RUN_COMPLETED",
  RUN_FAILED: "RUN_FAILED",
  PAYMENT_CREATED: "PAYMENT_CREATED",
  PAYMENT_APPROVED: "PAYMENT_APPROVED",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  MERCHANT_VERIFICATION_STARTED: "MERCHANT_VERIFICATION_STARTED",
  MERCHANT_VERIFICATION_COMPLETED: "MERCHANT_VERIFICATION_COMPLETED",
  MERCHANT_STATUS_CHANGED: "MERCHANT_STATUS_CHANGED",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
export type TimelineEventName = (typeof TIMELINE_EVENTS)[keyof typeof TIMELINE_EVENTS];
