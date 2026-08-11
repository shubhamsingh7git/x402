import { DeploymentModel, IDeploymentDoc } from "../models/Deployment.model";

export class DeploymentRepository {
  async save(data: Partial<IDeploymentDoc>): Promise<IDeploymentDoc> {
    return DeploymentModel.findOneAndUpdate(
      { deploymentId: data.deploymentId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IDeploymentDoc>;
  }

  async find(limit = 50): Promise<IDeploymentDoc[]> {
    return DeploymentModel.find({}).sort({ name: 1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return DeploymentModel.countDocuments(filter).exec();
  }
}

export const deploymentRepository = new DeploymentRepository();
