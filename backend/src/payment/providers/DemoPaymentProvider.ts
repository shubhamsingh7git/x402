import { AbstractPaymentProvider } from "./AbstractPaymentProvider";
import { PaymentContext } from "../dto/paymentContext";
import { PaymentResultDTO } from "../dto/paymentResult.dto";
import { DemoReceipt } from "../dto/receipt.dto";
import { getPaymentConfig } from "../config/payment.config";
import { logger } from "../../utils/logger";

export class DemoPaymentProvider extends AbstractPaymentProvider {
  readonly providerName = "DemoPaymentProvider";

  protected async executePayment(context: PaymentContext, startTime: number): Promise<PaymentResultDTO> {
    const config = getPaymentConfig();

    // 1. Simulate network latency
    const delay = config.simulationDelayMs + Math.floor(Math.random() * config.randomLatencyMs);
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // 2. Simulate random failure flag if configured
    if (config.randomFailureRate > 0 && Math.random() < config.randomFailureRate) {
      throw new Error("Simulated transient provider network failure (Random Failure Flag Active)");
    }

    // 3. Generate receipt
    const receipt = new DemoReceipt(
      context.paymentId,
      context.merchantId,
      context.amount,
      context.currency,
      context.network
    );

    const latencyMs = Date.now() - startTime;
    logger.info(`✅ Demo payment simulation succeeded [${receipt.transactionHash}] in ${latencyMs}ms`);

    return {
      success: true,
      paymentId: context.paymentId,
      correlationId: context.correlationId,
      status: "SETTLED",
      amount: context.amount,
      currency: context.currency,
      transactionId: receipt.transactionHash,
      receipt,
      latencyMs,
      metadata: {
        ...context.metadata,
        provider: this.providerName,
        transactionHash: receipt.transactionHash,
      },
    };
  }
}

export const demoPaymentProvider = new DemoPaymentProvider();
