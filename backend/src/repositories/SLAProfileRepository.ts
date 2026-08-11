import { SLAProfile, ISLAProfile } from "../models/SLAProfile.model";

export class SLAProfileRepository {
  async findByProviderId(providerId: string): Promise<ISLAProfile | null> {
    return SLAProfile.findOne({ providerId }).exec();
  }

  async upsert(providerId: string, data: Partial<ISLAProfile>): Promise<ISLAProfile> {
    return SLAProfile.findOneAndUpdate(
      { providerId },
      { $set: { ...data, providerId } },
      { upsert: true, new: true }
    ).exec() as Promise<ISLAProfile>;
  }
}

export const slaProfileRepository = new SLAProfileRepository();
