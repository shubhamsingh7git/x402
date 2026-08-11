import mongoose from "mongoose";
import { Merchant, IMerchantDocument } from "../models/Merchant";

export class MerchantRepository {
  async create(data: Partial<IMerchantDocument>): Promise<IMerchantDocument> {
    return Merchant.create(data);
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ data: IMerchantDocument[]; total: number }> {
    const finalFilter = { ...filter, isDeleted: false };
    const [data, total] = await Promise.all([
      Merchant.find(finalFilter).sort(sort).skip(skip).limit(limit),
      Merchant.countDocuments(finalFilter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IMerchantDocument | null> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const byId = await Merchant.findOne({ _id: id, isDeleted: false });
      if (byId) return byId;
    }
    return Merchant.findOne({ alias: id, isDeleted: false });
  }

  async findByWalletAddress(walletAddress: string): Promise<IMerchantDocument | null> {
    return Merchant.findOne({ walletAddress, isDeleted: false });
  }

  async updateById(id: string, data: Partial<IMerchantDocument>): Promise<IMerchantDocument | null> {
    return Merchant.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  }

  async softDelete(id: string): Promise<IMerchantDocument | null> {
    return Merchant.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }

  async countAll(): Promise<number> {
    return Merchant.countDocuments({ isDeleted: false });
  }
}

export const merchantRepository = new MerchantRepository();
