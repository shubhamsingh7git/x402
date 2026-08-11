import { PaymentRequestDTO, paymentRequestSchema } from "../dto/paymentRequest.dto";
import { PaymentContext } from "../dto/paymentContext";
import { PaymentResultDTO } from "../dto/paymentResult.dto";
import { PaymentStateMachine } from "../state/paymentState.machine";
import { paymentPolicyEvaluator } from "../policy/paymentPolicy.evaluator";
import { serviceRegistry } from "../registry/service.registry";
import { PaymentProviderFactory } from "../factory/paymentProvider.factory";
import { IPaymentProvider } from "../interfaces/paymentProvider.interface";
import { merchantVerificationService } from "../../services/merchantVerification/MerchantVerificationService";
import { transactionService } from "../../services/transaction/transaction.service";
import { auditService } from "../../services/audit/audit.service";
import { timelineService } from "../../services/timeline/timeline.service";
import { analyticsService } from "../../services/analytics/analytics.service";
import { eventBus } from "../../events/eventBus";
import { PAYMENT_EVENTS } from "../events/payment.events";
import { EVENTS, TIMELINE_EVENTS } from "../../constants/events";
import { InvalidPaymentError } from "../errors/payment.errors";
import { logger } from "../../utils/logger";

export class PaymentManager {
  private static instance: PaymentManager;

  private constructor() {}

  public static getInstance(): PaymentManager {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  public getActiveProvider(): IPaymentProvider {
    return PaymentProviderFactory.getProvider();
  }

  async processPayment(request: PaymentRequestDTO): Promise<PaymentResultDTO> {
    const startTime = Date.now();

    // 1. Validate DTO payload
    const parsed = paymentRequestSchema.safeParse(request);
    if (!parsed.success) {
      const messages = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      throw new InvalidPaymentError(`Validation failed: ${messages.join(", ")}`);
    }

    // 2. Create PaymentContext with correlation IDs
    const context = new PaymentContext(request);

    // 3. Resolve service price / endpoint metadata if serviceId provided
    if (context.serviceId) {
      const service = await serviceRegistry.getService(context.serviceId);
      if (service) {
        context.endpoint = service.endpoint;
        context.amount = service.price;
        context.merchantId = service.merchantId;
      }
    }

    // Event & Log: PAYMENT_CREATED
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_CREATED, { context });
    if (context.runId) {
      await timelineService.recordEvent(context.runId, TIMELINE_EVENTS.PAYMENT_CREATED, context.stepId, {
        paymentId: context.paymentId,
        merchantId: context.merchantId,
        amount: context.amount,
      });
    }

    // 4. State Machine -> VALIDATING & Merchant Verification
    PaymentStateMachine.transition(context, "VALIDATING");
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_VALIDATED, { context });

    try {
      const verifResult = await merchantVerificationService.verifyMerchant(context.merchantId);
      if (!verifResult.verified) {
        PaymentStateMachine.transition(context, "DENIED");
        const deniedTx = await transactionService.recordPaymentTransaction(context, {
          success: false,
          paymentId: context.paymentId,
          correlationId: context.correlationId,
          status: "DENIED",
          amount: context.amount,
          currency: context.currency,
          latencyMs: Date.now() - startTime,
          metadata: context.metadata,
          error: `Merchant verification failed: ${verifResult.reason}`,
        });
        eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_DENIED, {
          context,
          decision: { approved: false, reason: verifResult.reason },
          transactionId: deniedTx._id,
        });
        return {
          success: false,
          paymentId: context.paymentId,
          correlationId: context.correlationId,
          status: "DENIED",
          amount: context.amount,
          currency: context.currency,
          latencyMs: Date.now() - startTime,
          metadata: { ...context.metadata, decisionReason: verifResult.reason },
          error: `Merchant verification failed: ${verifResult.reason}`,
        };
      }
    } catch (err: any) {
      PaymentStateMachine.transition(context, "DENIED");
      return {
        success: false,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "DENIED",
        amount: context.amount,
        currency: context.currency,
        latencyMs: Date.now() - startTime,
        metadata: { ...context.metadata, decisionReason: err.message },
        error: err.message,
      };
    }

    // 5. State Machine -> POLICY_CHECK
    PaymentStateMachine.transition(context, "POLICY_CHECK");
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_POLICY_CHECK, { context });

    const decision = await paymentPolicyEvaluator.evaluate(context);

    if (!decision.approved) {
      // 6a. Policy DENIED
      PaymentStateMachine.transition(context, "DENIED");

      const deniedTx = await transactionService.recordPaymentTransaction(context, {
        success: false,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "DENIED",
        amount: context.amount,
        currency: context.currency,
        latencyMs: Date.now() - startTime,
        metadata: context.metadata,
        error: decision.reason,
      });

      await auditService.createLog(
        "POLICY_VIOLATION",
        {
          paymentId: context.paymentId,
          merchantId: context.merchantId,
          amount: context.amount,
          reason: decision.reason,
        },
        undefined,
        context.correlationId
      );

      eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_DENIED, { context, decision, transactionId: deniedTx._id });
      eventBus.emitEvent(EVENTS.POLICY_VIOLATION, { context, decision });
      eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "payment_denied" });

      if (context.runId) {
        await timelineService.recordEvent(context.runId, TIMELINE_EVENTS.STEP_FAILED, context.stepId, {
          paymentId: context.paymentId,
          reason: decision.reason,
        });
      }

      return {
        success: false,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "DENIED",
        amount: context.amount,
        currency: context.currency,
        latencyMs: Date.now() - startTime,
        metadata: { ...context.metadata, decisionReason: decision.reason },
        error: decision.reason,
      };
    }

    // 6b. Policy APPROVED
    PaymentStateMachine.transition(context, "APPROVED");
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_APPROVED, { context, decision });

    if (context.runId) {
      await timelineService.recordEvent(context.runId, TIMELINE_EVENTS.PAYMENT_APPROVED, context.stepId, {
        paymentId: context.paymentId,
        amount: context.amount,
      });
    }

    // 7. State Machine -> PREPARING -> READY -> PROCESSING
    PaymentStateMachine.transition(context, "PREPARING");
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_PREPARING, { context });

    PaymentStateMachine.transition(context, "READY");

    PaymentStateMachine.transition(context, "PROCESSING");
    eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_PROCESSING, { context });

    // 8. Execute via resolved provider (DemoPaymentProvider / X402PaymentProvider)
    const providerResult = await this.getActiveProvider().processPayment(context);

    // 9. State Machine -> COMPLETED (or FAILED)
    if (providerResult.success) {
      PaymentStateMachine.transition(context, "COMPLETED");

      const completedTx = await transactionService.recordPaymentTransaction(context, providerResult);

      await auditService.createLog(
        "PAYMENT_COMPLETED",
        {
          paymentId: context.paymentId,
          merchantId: context.merchantId,
          amount: context.amount,
          txHash: providerResult.transactionId,
        },
        undefined,
        context.correlationId
      );

      analyticsService.invalidateCache();

      eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_COMPLETED, {
        context,
        result: providerResult,
        transactionId: completedTx._id,
      });
      eventBus.emitEvent("transaction:added" as any, { transaction: completedTx });
      eventBus.emitEvent(EVENTS.DASHBOARD_REFRESH, { reason: "payment_completed" });

      if (context.runId) {
        await timelineService.recordEvent(context.runId, TIMELINE_EVENTS.PAYMENT_COMPLETED, context.stepId, {
          paymentId: context.paymentId,
          txHash: providerResult.transactionId,
          amount: context.amount,
        });
      }

      return providerResult;
    } else {
      PaymentStateMachine.transition(context, "FAILED");

      await transactionService.recordPaymentTransaction(context, providerResult);

      await auditService.createLog(
        "PAYMENT_FAILED",
        {
          paymentId: context.paymentId,
          merchantId: context.merchantId,
          amount: context.amount,
          error: providerResult.error,
        },
        undefined,
        context.correlationId
      );

      eventBus.emitEvent(PAYMENT_EVENTS.PAYMENT_FAILED, { context, error: providerResult.error });

      return providerResult;
    }
  }
}

export const paymentManager = PaymentManager.getInstance();
