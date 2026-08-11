import { IMerchantVerificationStrategy } from "../strategies/IMerchantVerificationStrategy";

export class MerchantVerificationStrategyRegistry {
  private static instance: MerchantVerificationStrategyRegistry;
  private strategies: Map<string, IMerchantVerificationStrategy> = new Map();

  private constructor() {}

  public static getInstance(): MerchantVerificationStrategyRegistry {
    if (!MerchantVerificationStrategyRegistry.instance) {
      MerchantVerificationStrategyRegistry.instance = new MerchantVerificationStrategyRegistry();
    }
    return MerchantVerificationStrategyRegistry.instance;
  }

  public register(strategy: IMerchantVerificationStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  public getStrategies(): IMerchantVerificationStrategy[] {
    return Array.from(this.strategies.values());
  }

  public clear(): void {
    this.strategies.clear();
  }
}

export const strategyRegistry = MerchantVerificationStrategyRegistry.getInstance();
