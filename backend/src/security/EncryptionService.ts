import crypto from "crypto";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class EncryptionService {
  private keyVersion = "v1.0.0";
  private masterKey = crypto.randomBytes(32);

  async rotateMasterKey() {
    this.keyVersion = `v1.${Date.now()}`;
    this.masterKey = crypto.randomBytes(32);

    logger.info(`🔑 EncryptionService rotated KMS Master Key to version: ${this.keyVersion}`);
    eventBus.emitEvent("security:keyRotated" as any, { keyVersion: this.keyVersion });
    return { keyVersion: this.keyVersion };
  }

  encrypt(plainText: string): { cipherText: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", this.masterKey, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");

    return {
      cipherText: encrypted,
      iv: iv.toString("hex"),
      tag,
    };
  }

  getKeyVersion() {
    return this.keyVersion;
  }
}

export const encryptionService = new EncryptionService();
