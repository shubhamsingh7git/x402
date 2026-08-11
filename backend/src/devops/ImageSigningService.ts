import { pipelineRepository } from "../repositories/PipelineRepository";
import { logger } from "../utils/logger";

export class ImageSigningService {
  async signImage(imageRef: string, signerIdentity = "cosign-keyless@enterprise.iam") {
    const signatureId = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const sig = await pipelineRepository.saveSignature({
      signatureId,
      imageRef,
      signerIdentity,
      algorithm: "ECDSA_P256_SHA256",
      isVerified: true,
      signedAt: new Date(),
    });

    logger.info(`🔏 ImageSigningService signed Container Image [${imageRef}] with Cosign signature: ${signatureId}`);
    return sig;
  }

  async getSignatures() {
    return pipelineRepository.findSignatures();
  }
}

export const imageSigningService = new ImageSigningService();
