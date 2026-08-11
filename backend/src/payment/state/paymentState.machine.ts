import { PaymentContext } from "../dto/paymentContext";
import { PaymentLifecycleLogger } from "../logger/paymentLifecycle.logger";
import { PaymentStateError } from "../errors/payment.errors";

export type PaymentState =
  | "CREATED"
  | "VALIDATING"
  | "POLICY_CHECK"
  | "APPROVED"
  | "DENIED"
  | "PREPARING"
  | "READY"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

const VALID_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  CREATED: ["VALIDATING", "FAILED", "CANCELLED"],
  VALIDATING: ["POLICY_CHECK", "FAILED", "CANCELLED"],
  POLICY_CHECK: ["APPROVED", "DENIED", "FAILED", "CANCELLED"],
  APPROVED: ["PREPARING", "FAILED", "CANCELLED"],
  DENIED: [],
  PREPARING: ["READY", "FAILED", "CANCELLED"],
  READY: ["PROCESSING", "FAILED", "CANCELLED"],
  PROCESSING: ["COMPLETED", "FAILED", "CANCELLED"],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: [],
};

export class PaymentStateMachine {
  public static transition(context: PaymentContext, targetState: PaymentState): void {
    const currentState = context.state as PaymentState;
    const allowed = VALID_TRANSITIONS[currentState] || [];

    if (!allowed.includes(targetState)) {
      throw new PaymentStateError(currentState, targetState, context.paymentId);
    }

    PaymentLifecycleLogger.logStateTransition(context, currentState, targetState);
    context.state = targetState;
  }
}
