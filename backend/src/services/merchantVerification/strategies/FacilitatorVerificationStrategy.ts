import { IMerchantVerificationStrategy } from "./IMerchantVerificationStrategy";
import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";
import { env } from "../../../config/env";

export class FacilitatorVerificationStrategy implements IMerchantVerificationStrategy {
  public name = "facilitator";

  async execute(_context: MerchantVerificationContext): Promise<StrategyResult> {
    if (!env.X402_FACILITATOR_URL || env.X402_FACILITATOR_URL.trim().length === 0) {
      return {
        name: this.name,
        status: "FAIL",
        reason: "X402 Facilitator endpoint URL is not configured",
      };
    }

    return {
      name: this.name,
      status: "PASS",
    };
  }
}
