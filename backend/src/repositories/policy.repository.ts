import mongoose from "mongoose";
import { Policy, IPolicyDocument } from "../models/Policy";
import { Merchant } from "../models/Merchant";

export class PolicyRepository {
  async create(data: Partial<IPolicyDocument>): Promise<IPolicyDocument> {
    return Policy.create(data);
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ data: IPolicyDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      Policy.find(filter).populate("merchant").sort(sort).skip(skip).limit(limit),
      Policy.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IPolicyDocument | null> {
    return Policy.findById(id).populate("merchant");
  }

  async findByMerchantId(merchantId: string): Promise<IPolicyDocument | null> {
    if (mongoose.Types.ObjectId.isValid(merchantId)) {
      const policy = await Policy.findOne({ merchant: merchantId }).populate("merchant");
      if (policy) return policy;
    }

    // Fallback: resolve merchant by alias
    const merchant = await Merchant.findOne({ alias: merchantId, isDeleted: false });
    if (merchant) {
      const policy = await Policy.findOne({ merchant: merchant._id }).populate("merchant");
      if (policy) return policy;
    }

    // Default policy fallback
    return Policy.findOne({ isDefault: true, enabled: true }).populate("merchant");
  }

  async updateById(id: string, data: Partial<IPolicyDocument>): Promise<IPolicyDocument | null> {
    return Policy.findByIdAndUpdate(id, data, { new: true }).populate("merchant");
  }

  async deleteById(id: string): Promise<IPolicyDocument | null> {
    return Policy.findByIdAndDelete(id);
  }

  async countAll(): Promise<number> {
    return Policy.countDocuments({ enabled: true, killSwitch: false });
  }
}

export const policyRepository = new PolicyRepository();
