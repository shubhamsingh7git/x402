import { AutoscalingPolicyModel, IAutoscalingPolicyDoc } from "../models/AutoscalingPolicy.model";

export class AutoscalingRepository {
  async save(data: Partial<IAutoscalingPolicyDoc>): Promise<IAutoscalingPolicyDoc> {
    return AutoscalingPolicyModel.findOneAndUpdate(
      { policyId: data.policyId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IAutoscalingPolicyDoc>;
  }

  async find(limit = 50): Promise<IAutoscalingPolicyDoc[]> {
    return AutoscalingPolicyModel.find({}).sort({ deploymentName: 1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return AutoscalingPolicyModel.countDocuments().exec();
  }
}

export const autoscalingRepository = new AutoscalingRepository();
