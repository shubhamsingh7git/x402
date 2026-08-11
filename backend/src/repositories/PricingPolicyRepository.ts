import { PricingPolicy, IPricingPolicy } from "../models/PricingPolicy.model";

export class PricingPolicyRepository {
  async findByProviderId(providerId: string): Promise<IPricingPolicy | null> {
    return PricingPolicy.findOne({ providerId }).exec();
  }

  async upsert(providerId: string, data: Partial<IPricingPolicy>): Promise<IPricingPolicy> {
    return PricingPolicy.findOneAndUpdate(
      { providerId },
      { $set: { ...data, providerId } },
      { upsert: true, new: true }
    ).exec() as Promise<IPricingPolicy>;
  }
}

export const pricingPolicyRepository = new PricingPolicyRepository();
