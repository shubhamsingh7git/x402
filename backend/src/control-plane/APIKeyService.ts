import { APIKeyModel, IAPIKeyDoc } from "../models/APIKey.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";
import crypto from "crypto";

export class APIKeyRepository {
  async create(data: Partial<IAPIKeyDoc>): Promise<IAPIKeyDoc> {
    const doc = new APIKeyModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IAPIKeyDoc[]> {
    return APIKeyModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return APIKeyModel.countDocuments(filter).exec();
  }
}

export const apiKeyRepository = new APIKeyRepository();

export class APIKeyService {
  async createAPIKey(data: { organizationId: string; keyName: string; scopes?: string[] }) {
    const rawKey = `x402_live_${crypto.randomBytes(24).toString("hex")}`;
    const maskedKey = `${rawKey.substring(0, 10)}...${rawKey.substring(rawKey.length - 4)}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const apiKey = await apiKeyRepository.create({
      keyId,
      organizationId: data.organizationId,
      keyName: data.keyName,
      keyHash,
      maskedKey,
      scopes: data.scopes || ["planner:read", "execution:start"],
      status: "ACTIVE",
    });

    logger.info(`🔑 APIKeyService created API Key [${keyId}] (${data.keyName})`);
    eventBus.emitEvent("controlplane:apiKeyCreated" as any, apiKey as any);

    return {
      ...apiKey.toObject(),
      rawKey,
    };
  }

  async getAPIKeys() {
    return apiKeyRepository.find(50);
  }
}

export const apiKeyService = new APIKeyService();
