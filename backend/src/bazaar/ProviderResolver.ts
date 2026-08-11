import { providerListingRepository } from "../repositories/ProviderListingRepository";
import { merchantService } from "../services/merchant/merchant.service";
import { IProviderListing } from "../models/ProviderListing.model";

export class ProviderResolver {
  async resolveProviderWithTelemetry(providerId: string): Promise<any | null> {
    const listing: any = await providerListingRepository.findByProviderId(providerId);
    if (!listing) return null;

    let merchantDetails = null;
    if (listing.merchantId?._id) {
      try {
        merchantDetails = await merchantService.getMerchantById(listing.merchantId._id.toString());
      } catch (err) {
        // Fallback to populated object
        merchantDetails = listing.merchantId;
      }
    }

    return {
      ...listing.toObject(),
      merchant: merchantDetails,
    };
  }
}

export const providerResolver = new ProviderResolver();
