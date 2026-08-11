import { FeatureFlagModel, IFeatureFlagDoc } from "../models/FeatureFlag.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class FeatureFlagRepository {
  async create(data: Partial<IFeatureFlagDoc>): Promise<IFeatureFlagDoc> {
    const doc = new FeatureFlagModel(data);
    return doc.save();
  }

  async findByFlagId(flagId: string): Promise<IFeatureFlagDoc | null> {
    return FeatureFlagModel.findOne({ flagId }).exec();
  }

  async updateEnabled(flagId: string, enabled: boolean): Promise<IFeatureFlagDoc | null> {
    return FeatureFlagModel.findOneAndUpdate({ flagId }, { $set: { enabled } }, { new: true }).exec();
  }

  async find(limit = 50): Promise<IFeatureFlagDoc[]> {
    return FeatureFlagModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return FeatureFlagModel.countDocuments().exec();
  }
}

export const featureFlagRepository = new FeatureFlagRepository();

export class FeatureFlagService {
  async createFeatureFlag(data: { name: string; key: string; enabled?: boolean; targetScope?: any; targetId?: string }) {
    const flagId = `flag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const flag = await featureFlagRepository.create({
      ...data,
      flagId,
      enabled: data.enabled ?? true,
      targetScope: data.targetScope || "GLOBAL",
    });

    logger.info(`🚩 FeatureFlagService created flag [${flagId}] (${data.key})`);
    eventBus.emitEvent("controlplane:featureFlagUpdated" as any, flag as any);
    return flag;
  }

  async updateFeatureFlagStatus(flagId: string, enabled: boolean) {
    const flag = await featureFlagRepository.updateEnabled(flagId, enabled);
    if (!flag) throw new Error(`Feature flag '${flagId}' not found`);

    logger.info(`🚩 FeatureFlagService updated flag [${flagId}] -> enabled: ${enabled}`);
    eventBus.emitEvent("controlplane:featureFlagUpdated" as any, flag as any);
    return flag;
  }

  async getFeatureFlags() {
    return featureFlagRepository.find(50);
  }
}

export const featureFlagService = new FeatureFlagService();
