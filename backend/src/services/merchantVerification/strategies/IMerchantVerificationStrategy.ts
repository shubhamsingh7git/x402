import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";

export interface IMerchantVerificationStrategy {
  name: string;
  execute(context: MerchantVerificationContext): Promise<StrategyResult>;
}
