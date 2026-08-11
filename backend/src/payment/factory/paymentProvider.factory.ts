import { IPaymentProvider } from "../interfaces/paymentProvider.interface";
import { demoPaymentProvider } from "../providers/DemoPaymentProvider";
import { x402PaymentProvider } from "../x402/providers/X402PaymentProvider";
import { realX402PaymentProvider } from "../algorand/provider/RealX402PaymentProvider";
import { PaymentMode } from "../config/payment.config";
import { PaymentConfigurationError } from "../errors/payment.errors";
import { logger } from "../../utils/logger";

export class PaymentProviderRegistry {
  private static instance: PaymentProviderRegistry;
  private providers = new Map<string, IPaymentProvider>();

  private constructor() {
    this.register("demo", demoPaymentProvider);
    this.register("dry-run", demoPaymentProvider);
    this.register("protocol", x402PaymentProvider);
    this.register("live", realX402PaymentProvider);
  }

  public static getInstance(): PaymentProviderRegistry {
    if (!PaymentProviderRegistry.instance) {
      PaymentProviderRegistry.instance = new PaymentProviderRegistry();
    }
    return PaymentProviderRegistry.instance;
  }

  public register(mode: string, provider: IPaymentProvider): void {
    this.providers.set(mode.toLowerCase(), provider);
    logger.info(`🔌 Registered payment provider [${provider.providerName}] for mode [${mode}]`);
  }

  public resolve(mode: PaymentMode): IPaymentProvider {
    const key = mode.toLowerCase();
    const provider = this.providers.get(key);

    if (!provider) {
      throw new PaymentConfigurationError(`No payment provider registered for mode '${mode}'`);
    }

    return provider;
  }
}

export const paymentProviderRegistry = PaymentProviderRegistry.getInstance();

import { env } from "../../config/env";

export class PaymentProviderFactory {
  public static getProvider(mode?: PaymentMode): IPaymentProvider {
    const activeMode = (mode || env.PAYMENT_MODE) as PaymentMode;
    return paymentProviderRegistry.resolve(activeMode);
  }
}
