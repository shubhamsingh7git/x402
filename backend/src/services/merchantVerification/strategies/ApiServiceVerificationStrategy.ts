import { IMerchantVerificationStrategy } from "./IMerchantVerificationStrategy";
import { MerchantVerificationContext } from "../MerchantVerificationContext";
import { StrategyResult } from "../MerchantVerificationResult";
import { ApiService } from "../../../models/ApiService";

export class ApiServiceVerificationStrategy implements IMerchantVerificationStrategy {
  public name = "apiService";

  async execute(context: MerchantVerificationContext): Promise<StrategyResult> {
    const { alias, _id } = context.merchant;
    const service = await ApiService.findOne({
      $or: [{ merchantId: alias }, { merchant: _id }],
    });

    if (!service) {
      return {
        name: this.name,
        status: "FAIL",
        reason: `No registered ApiService found for merchant [${alias}]`,
      };
    }

    return {
      name: this.name,
      status: "PASS",
    };
  }
}
