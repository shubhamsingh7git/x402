import { QuotaPolicyModel, IQuotaPolicyDoc } from "../models/QuotaPolicy.model";
import { logger } from "../utils/logger";

export class QuotaRepository {
  async upsert(data: Partial<IQuotaPolicyDoc>): Promise<IQuotaPolicyDoc> {
    return QuotaPolicyModel.findOneAndUpdate(
      { organizationId: data.organizationId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IQuotaPolicyDoc>;
  }

  async find(limit = 50): Promise<IQuotaPolicyDoc[]> {
    return QuotaPolicyModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }
}

export const quotaRepository = new QuotaRepository();

export class QuotaService {
  async getQuotas() {
    return quotaRepository.find(50);
  }

  async setQuotaPolicy(organizationId: string, maxDailySpendUsd = 500, maxDailyRequests = 10000) {
    const quotaId = `quota_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const policy = await quotaRepository.upsert({
      quotaId,
      organizationId,
      maxDailySpendUsd,
      maxDailyRequests,
    });

    logger.info(`📊 QuotaService updated Quota Policy for Org [${organizationId}]`);
    return policy;
  }
}

export const quotaService = new QuotaService();
