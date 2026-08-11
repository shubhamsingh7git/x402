import { DisasterRecoveryValidationModel, IDisasterRecoveryValidationDoc } from "../models/DisasterRecoveryValidation.model";

export class RecoveryRepository {
  async saveValidation(data: Partial<IDisasterRecoveryValidationDoc>): Promise<IDisasterRecoveryValidationDoc> {
    const doc = new DisasterRecoveryValidationModel(data);
    return doc.save();
  }

  async findLatestValidation(): Promise<IDisasterRecoveryValidationDoc | null> {
    return DisasterRecoveryValidationModel.findOne({}).sort({ testedAt: -1 }).exec();
  }
}

export const recoveryRepository = new RecoveryRepository();
