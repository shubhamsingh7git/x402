import { capabilityRepository } from "../repositories/CapabilityRepository";
import { providerListingRepository } from "../repositories/ProviderListingRepository";
import { ICapability } from "../models/Capability.model";

export class CapabilityResolver {
  async resolveCapabilityWithProviders(capabilityName: string): Promise<any | null> {
    const capability = await capabilityRepository.findByName(capabilityName);
    if (!capability) return null;

    const res = await providerListingRepository.find({ capability: capability.name, limit: 50 });

    return {
      ...capability.toObject(),
      providerCount: res.total,
      providers: res.data,
    };
  }
}

export const capabilityResolver = new CapabilityResolver();
