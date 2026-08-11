import { providerListingRepository } from "../repositories/ProviderListingRepository";
import { IBazaarSearchParams } from "./BazaarTypes";
import { IProviderListing } from "../models/ProviderListing.model";

export class BazaarSearch {
  async filterCandidates(params: IBazaarSearchParams): Promise<IProviderListing[]> {
    const filters = {
      capability: params.capability,
      network: params.network,
      status: params.status || "ACTIVE",
      availability: params.availability !== undefined ? params.availability : true,
      merchantId: params.merchantId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      page: 1,
      limit: 100,
    };

    const res = await providerListingRepository.find(filters);
    let listings = res.data;

    if (params.merchantVerifiedOnly) {
      listings = listings.filter((item: any) => {
        const merchant = item.merchantId;
        return merchant && (merchant.status === "Verified" || merchant.status === "VERIFIED");
      });
    }

    return listings;
  }
}

export const bazaarSearch = new BazaarSearch();
