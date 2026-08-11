import { ProviderReputation, IProviderReputation } from "../models/ProviderReputation.model";

export class ProviderReputationRepository {
  async findByProviderId(providerId: string): Promise<IProviderReputation | null> {
    return ProviderReputation.findOne({ providerId }).exec();
  }

  async upsert(providerId: string, data: Partial<IProviderReputation>): Promise<IProviderReputation> {
    return ProviderReputation.findOneAndUpdate(
      { providerId },
      { $set: { ...data, providerId, lastRecalculatedAt: new Date() } },
      { upsert: true, new: true }
    ).exec() as Promise<IProviderReputation>;
  }
}

export const providerReputationRepository = new ProviderReputationRepository();
