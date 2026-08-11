import { RegionModel, IRegionDoc } from "../models/Region.model";
import { FailoverPolicyModel, IFailoverPolicyDoc } from "../models/FailoverPolicy.model";

export class AvailabilityRepository {
  async saveRegion(data: Partial<IRegionDoc>): Promise<IRegionDoc> {
    return RegionModel.findOneAndUpdate(
      { regionId: data.regionId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IRegionDoc>;
  }

  async findRegions(): Promise<IRegionDoc[]> {
    return RegionModel.find({}).sort({ name: 1 }).exec();
  }

  async savePolicy(data: Partial<IFailoverPolicyDoc>): Promise<IFailoverPolicyDoc> {
    return FailoverPolicyModel.findOneAndUpdate(
      { policyId: data.policyId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IFailoverPolicyDoc>;
  }

  async findPolicies(): Promise<IFailoverPolicyDoc[]> {
    return FailoverPolicyModel.find({}).exec();
  }

  async countRegions(): Promise<number> {
    return RegionModel.countDocuments().exec();
  }
}

export const availabilityRepository = new AvailabilityRepository();
