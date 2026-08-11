import {
  MerchantVerificationLog,
  IMerchantVerificationLogDocument,
} from "../models/MerchantVerificationLog";

export class MerchantVerificationLogRepository {
  async createLog(data: Partial<IMerchantVerificationLogDocument>): Promise<IMerchantVerificationLogDocument> {
    return MerchantVerificationLog.create(data);
  }

  async getLogsByMerchantId(merchantId: string, limit = 20): Promise<IMerchantVerificationLogDocument[]> {
    return MerchantVerificationLog.find({ merchant: merchantId })
      .sort({ checkedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getLatestLog(merchantId: string): Promise<IMerchantVerificationLogDocument | null> {
    return MerchantVerificationLog.findOne({ merchant: merchantId })
      .sort({ checkedAt: -1 })
      .exec();
  }
}

export const merchantVerificationLogRepository = new MerchantVerificationLogRepository();
