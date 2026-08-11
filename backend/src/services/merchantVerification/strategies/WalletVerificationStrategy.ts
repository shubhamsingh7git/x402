import { IMerchantVerificationStrategy } from "./IMerchantVerificationStrategy";
import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";

export class WalletVerificationStrategy implements IMerchantVerificationStrategy {
  public name = "wallet";

  async execute(context: MerchantVerificationContext): Promise<StrategyResult> {
    const { walletAddress } = context.merchant;
    if (!walletAddress || walletAddress.trim().length < 4) {
      return {
        name: this.name,
        status: "FAIL",
        reason: "Invalid or missing wallet address",
      };
    }

    return {
      name: this.name,
      status: "PASS",
    };
  }
}
