export const PAYMENT_EVENTS = {
  PAYMENT_CREATED: "payment:created",
  PAYMENT_VALIDATED: "payment:validated",
  PAYMENT_POLICY_CHECK: "payment:policyCheck",
  PAYMENT_APPROVED: "payment:approved",
  PAYMENT_DENIED: "payment:denied",
  PAYMENT_PREPARING: "payment:preparing",
  PAYMENT_PROCESSING: "payment:processing",
  PAYMENT_COMPLETED: "payment:completed",
  PAYMENT_FAILED: "payment:failed",
  PAYMENT_CANCELLED: "payment:cancelled",
} as const;

export type PaymentEventName = (typeof PAYMENT_EVENTS)[keyof typeof PAYMENT_EVENTS];
