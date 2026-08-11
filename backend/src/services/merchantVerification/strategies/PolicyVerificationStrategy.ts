import { IMerchantVerificationStrategy } from "./IMerchantVerificationStrategy";
import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";
import { Policy } from "../../../models/Policy";

export class PolicyVerificationStrategy implements IMerchantVerificationStrategy {
  public name = "policy";

  async execute(context: MerchantVerificationContext): Promise<StrategyResult> {
    const { alias, _id } = context.merchant;
    const policy = await Policy.findOne({
      $or: [
        { merchantId: alias },
        { merchantId: _id.toString() },
        { merchant: _id },
        { isDefault: true },
      ],
      enabled: true,
    });

    if (!policy) {
      return {
        name: this.name,
        status: "FAIL",
        reason: `No active policy rule found for merchant [${alias}]`,
      };
    }

    return {
      name: this.name,
      status: "PASS",
    };
  }
}
