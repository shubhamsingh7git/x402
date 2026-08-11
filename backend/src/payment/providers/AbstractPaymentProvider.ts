import { IPaymentProvider } from "../interfaces/paymentProvider.interface";
import { PaymentContext } from "../dto/paymentContext";
import { PaymentResultDTO } from "../dto/paymentResult.dto";
import { paymentMetricsService } from "../metrics/paymentMetrics.service";
import { InvalidPaymentError } from "../errors/payment.errors";
import { logger } from "../../utils/logger";

export abstract class AbstractPaymentProvider implements IPaymentProvider {
  abstract readonly providerName: string;

  supports(network: string): boolean {
    return !!network;
  }

  async processPayment(context: PaymentContext): Promise<PaymentResultDTO> {
    const startTime = Date.now();
    paymentMetricsService.recordPaymentAttempt();

    try {
      this.validateContext(context);
      const result = await this.executePayment(context, startTime);
      const latencyMs = Date.now() - startTime;

      paymentMetricsService.recordPaymentSuccess(context.amount, latencyMs);
      return { ...result, latencyMs };
    } catch (error: any) {
      paymentMetricsService.recordPaymentFailure();
      logger.error({ err: error, paymentId: context.paymentId }, `Payment processing failed in ${this.providerName}`);

      return {
        success: false,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "FAILED",
        amount: context.amount,
        currency: context.currency,
        latencyMs: Date.now() - startTime,
        metadata: context.metadata,
        error: error.message || "Payment processing exception",
      };
    }
  }

  protected validateContext(context: PaymentContext): void {
    if (!context.merchantId) {
      throw new InvalidPaymentError("Missing merchantId in payment context", context.paymentId);
    }
    if (context.amount < 0) {
      throw new InvalidPaymentError("Negative payment amount requested", context.paymentId);
    }
  }

  protected abstract executePayment(context: PaymentContext, startTime: number): Promise<PaymentResultDTO>;
}
