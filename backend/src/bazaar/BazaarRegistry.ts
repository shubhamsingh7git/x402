import { providerListingRepository, ProviderQueryFilters } from "../repositories/ProviderListingRepository";
import { capabilityRepository } from "../repositories/CapabilityRepository";
import { IProviderListing } from "../models/ProviderListing.model";
import { ICapability } from "../models/Capability.model";

export class BazaarRegistry {
  async registerProvider(payload: Partial<IProviderListing>): Promise<IProviderListing> {
    if (!payload.providerId) {
      payload.providerId = `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    return providerListingRepository.create(payload);
  }

  async updateProvider(id: string, payload: Partial<IProviderListing>): Promise<IProviderListing | null> {
    return providerListingRepository.update(id, payload);
  }

  async removeProvider(id: string): Promise<boolean> {
    return providerListingRepository.delete(id);
  }

  async getProviderById(id: string): Promise<IProviderListing | null> {
    return providerListingRepository.findById(id);
  }

  async listProviders(filters: ProviderQueryFilters = {}) {
    return providerListingRepository.find(filters);
  }

  async registerCapability(payload: Partial<ICapability>): Promise<ICapability> {
    if (payload.name) {
      payload.name = payload.name.toLowerCase().trim();
    }
    return capabilityRepository.create(payload);
  }

  async listCapabilities(category?: string): Promise<ICapability[]> {
    const filter = category ? { category: category.toUpperCase() } : {};
    return capabilityRepository.find(filter);
  }
}

export const bazaarRegistry = new BazaarRegistry();
