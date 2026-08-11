import { AuthorizationPolicyModel, IAuthorizationPolicyDoc } from "../models/AuthorizationPolicy.model";

export class SecurityPolicyRepository {
  async save(data: Partial<IAuthorizationPolicyDoc>): Promise<IAuthorizationPolicyDoc> {
    return AuthorizationPolicyModel.findOneAndUpdate(
      { policyId: data.policyId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IAuthorizationPolicyDoc>;
  }

  async find(limit = 50): Promise<IAuthorizationPolicyDoc[]> {
    return AuthorizationPolicyModel.find({}).sort({ policyName: 1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return AuthorizationPolicyModel.countDocuments().exec();
  }
}

export const securityPolicyRepository = new SecurityPolicyRepository();
