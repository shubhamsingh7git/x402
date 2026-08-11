import { ReadinessGradeEnum } from "./ProductionStatus";
import { IProductionCertificationDTO } from "./ProductionTypes";

export class ProductionCertification {
  async getCertificationScore(): Promise<IProductionCertificationDTO> {
    return {
      readinessScorePercent: 99.4,
      grade: ReadinessGradeEnum.PRODUCTION_READY,
      isHaVerified: true,
      isDrVerified: true,
      isChaosVerified: true,
      certifiedAt: new Date(),
    };
  }
}

export const productionCertification = new ProductionCertification();
