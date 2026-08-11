import { ChaosExperimentModel, IChaosExperimentDoc } from "../models/ChaosExperiment.model";

export class ChaosRepository {
  async save(data: Partial<IChaosExperimentDoc>): Promise<IChaosExperimentDoc> {
    return ChaosExperimentModel.findOneAndUpdate(
      { experimentId: data.experimentId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IChaosExperimentDoc>;
  }

  async find(): Promise<IChaosExperimentDoc[]> {
    return ChaosExperimentModel.find({}).sort({ title: 1 }).exec();
  }

  async count(): Promise<number> {
    return ChaosExperimentModel.countDocuments().exec();
  }
}

export const chaosRepository = new ChaosRepository();
