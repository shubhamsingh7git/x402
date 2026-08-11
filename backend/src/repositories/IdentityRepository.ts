import { IdentityModel, IIdentityDoc } from "../models/Identity.model";

export class IdentityRepository {
  async create(data: Partial<IIdentityDoc>): Promise<IIdentityDoc> {
    const doc = new IdentityModel(data);
    return doc.save();
  }

  async findByUserId(userId: string): Promise<IIdentityDoc | null> {
    return IdentityModel.findOne({ userId }).exec();
  }

  async count(): Promise<number> {
    return IdentityModel.countDocuments().exec();
  }
}

export const identityRepository = new IdentityRepository();
