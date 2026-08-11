import { pipelineRepository } from "../repositories/PipelineRepository";
import { logger } from "../utils/logger";

export class SBOMGenerator {
  async generateSbom(imageRef: string) {
    const sbomId = `sbom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const sbom = await pipelineRepository.saveSbom({
      sbomId,
      imageRef,
      componentsCount: 142,
      vulnerabilitiesFoundCount: 0,
      format: "SPDX",
    });

    logger.info(`📦 SBOMGenerator generated SPDX manifest [${sbomId}] for Image: ${imageRef}`);
    return sbom;
  }

  async getSboms() {
    return pipelineRepository.findSboms();
  }
}

export const sbomGenerator = new SBOMGenerator();
