import { env } from "../../config/env";

export type PaymentMode = "demo" | "dry-run" | "protocol" | "live";

export interface PaymentConfig {
  mode: PaymentMode;
  simulationDelayMs: number;
  randomFailureRate: number;
  randomLatencyMs: number;
  defaultNetwork: string;
  defaultAsset: string;
}

export const getPaymentConfig = (): PaymentConfig => {
  const mode = env.PAYMENT_MODE as PaymentMode;

  return {
    mode,
    simulationDelayMs: env.PAYMENT_SIMULATION_DELAY,
    randomFailureRate: env.PAYMENT_RANDOM_FAILURE_RATE,
    randomLatencyMs: env.PAYMENT_RANDOM_LATENCY,
    defaultNetwork: env.PAYMENT_DEFAULT_NETWORK,
    defaultAsset: env.PAYMENT_DEFAULT_ASSET,
  };
};
