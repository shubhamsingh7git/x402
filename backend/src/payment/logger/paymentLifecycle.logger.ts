import { PaymentContext } from "../dto/paymentContext";
import { logger } from "../../utils/logger";

export class PaymentLifecycleLogger {
  public static logStateTransition(context: PaymentContext, fromState: string, toState: string): void {
    logger.info(
      {
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        runId: context.runId,
        stepId: context.stepId,
        merchantId: context.merchantId,
        amount: context.amount,
        fromState,
        toState,
      },
      `💳 Payment State Transition [${fromState} ➔ ${toState}]`
    );
  }

  public static logPolicyDecision(context: PaymentContext, decision: { approved: boolean; reason: string }): void {
    const level = decision.approved ? "info" : "warn";
    logger[level](
      {
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        merchantId: context.merchantId,
        amount: context.amount,
        approved: decision.approved,
        reason: decision.reason,
      },
      `🛡️ Policy Decision: ${decision.approved ? "APPROVED" : "DENIED"} (${decision.reason})`
    );
  }
}
