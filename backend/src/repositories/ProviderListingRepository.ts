import { ProviderListing, IProviderListing } from "../models/ProviderListing.model";
import { FilterQuery } from "mongoose";

export interface ProviderQueryFilters {
  capability?: string;
  network?: string;
  status?: string;
  availability?: boolean;
  merchantId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class ProviderListingRepository {
  async create(data: Partial<IProviderListing>): Promise<IProviderListing> {
    const doc = new ProviderListing(data);
    return doc.save();
  }

  async findById(id: string): Promise<IProviderListing | null> {
    return ProviderListing.findById(id).populate("merchantId").exec();
  }

  async findByProviderId(providerId: string): Promise<IProviderListing | null> {
    return ProviderListing.findOne({ providerId }).populate("merchantId").exec();
  }

  async find(filters: ProviderQueryFilters = {}): Promise<{ data: IProviderListing[]; total: number; page: number; limit: number; totalPages: number }> {
    const query: FilterQuery<IProviderListing> = {};

    if (filters.capability) {
      query.capabilities = filters.capability.toLowerCase();
    }

    if (filters.network) {
      query.supportedNetworks = filters.network;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.availability !== undefined) {
      query.availability = filters.availability;
    }

    if (filters.merchantId) {
      query.merchantId = filters.merchantId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerCall = {};
      if (filters.minPrice !== undefined) query.pricePerCall.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.pricePerCall.$lte = filters.maxPrice;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { providerId: searchRegex },
        { capabilities: searchRegex },
        { supportedNetworks: searchRegex },
      ];
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;

    const sortField = filters.sortBy || "createdAt";
    const sortDirection = filters.sortOrder === "asc" ? 1 : -1;

    const [data, total] = await Promise.all([
      ProviderListing.find(query)
        .populate("merchantId")
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      ProviderListing.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { data, total, page, limit, totalPages };
  }

  async update(id: string, data: Partial<IProviderListing>): Promise<IProviderListing | null> {
    return ProviderListing.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("merchantId").exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await ProviderListing.findByIdAndDelete(id).exec();
    return !!res;
  }

  async count(filter: FilterQuery<IProviderListing> = {}): Promise<number> {
    return ProviderListing.countDocuments(filter).exec();
  }
}

export const providerListingRepository = new ProviderListingRepository();
