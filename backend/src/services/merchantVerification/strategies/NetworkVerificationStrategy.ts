import { IMerchantVerificationStrategy } from "./IMerchantVerificationStrategy";
import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";

export class NetworkVerificationStrategy implements IMerchantVerificationStrategy {
  public name = "network";

  async execute(context: MerchantVerificationContext): Promise<StrategyResult> {
    const { network } = context.merchant;
    if (!network || network.trim().length === 0) {
      return {
        name: this.name,
        status: "FAIL",
        reason: "Missing or invalid payment network specification",
      };
    }

    return {
      name: this.name,
      status: "PASS",
    };
  }
}
