import { SecretModel, ISecretDoc } from "../models/Secret.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";
import crypto from "crypto";

export class SecretRepository {
  async create(data: Partial<ISecretDoc>): Promise<ISecretDoc> {
    const doc = new SecretModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<ISecretDoc[]> {
    return SecretModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return SecretModel.countDocuments().exec();
  }
}

export const secretRepository = new SecretRepository();

export class SecretsManager {
  private encrypt(value: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from("12345678901234567890123456789012"), Buffer.from("1234567890123456"));
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  async storeSecret(data: { organizationId: string; keyName: string; secretValue: string }) {
    const secretId = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const encryptedValue = this.encrypt(data.secretValue);

    const secret = await secretRepository.create({
      secretId,
      organizationId: data.organizationId,
      keyName: data.keyName,
      encryptedValue,
      version: 1,
      status: "ACTIVE",
    });

    logger.info(`🔒 SecretsManager stored Secret [${secretId}] (${data.keyName})`);
    eventBus.emitEvent("controlplane:secretRotated" as any, secret as any);
    return secret;
  }

  async getSecrets() {
    return secretRepository.find(50);
  }
}

export const secretsManager = new SecretsManager();
