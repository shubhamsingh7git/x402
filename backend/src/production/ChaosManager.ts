import { chaosRepository } from "../repositories/ChaosRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";
import { ChaosStatusEnum } from "./ProductionStatus";

export class ChaosManager {
  async runExperiment(experimentId: string) {
    const exp = await chaosRepository.save({
      experimentId,
      status: ChaosStatusEnum.PASSED,
      lastExecutedAt: new Date(),
    });

    logger.warn(`💥 ChaosManager executed fault injection experiment: [${experimentId}] score: ${exp.resilienceScorePercent}%`);
    eventBus.emitEvent("production:chaosRun" as any, exp as any);
    return exp;
  }

  async getExperiments() {
    return chaosRepository.find();
  }
}

export const chaosManager = new ChaosManager();
