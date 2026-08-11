import { ProviderProfile, IProviderProfile } from "../models/ProviderProfile.model";
import { FilterQuery } from "mongoose";

export class ProviderProfileRepository {
  async create(data: Partial<IProviderProfile>): Promise<IProviderProfile> {
    const doc = new ProviderProfile(data);
    return doc.save();
  }

  async findByProviderId(providerId: string): Promise<IProviderProfile | null> {
    return ProviderProfile.findOne({ providerId }).exec();
  }

  async updateByProviderId(providerId: string, data: Partial<IProviderProfile>): Promise<IProviderProfile | null> {
    return ProviderProfile.findOneAndUpdate({ providerId }, { $set: data }, { new: true }).exec();
  }

  async find(filter: FilterQuery<IProviderProfile> = {}, limit = 50, skip = 0): Promise<IProviderProfile[]> {
    return ProviderProfile.find(filter).sort({ reputationScore: -1, createdAt: -1 }).skip(skip).limit(limit).exec();
  }

  async count(filter: FilterQuery<IProviderProfile> = {}): Promise<number> {
    return ProviderProfile.countDocuments(filter).exec();
  }

  async deleteByProviderId(providerId: string): Promise<boolean> {
    const res = await ProviderProfile.deleteOne({ providerId }).exec();
    return (res.deletedCount || 0) > 0;
  }
}

export const providerProfileRepository = new ProviderProfileRepository();
