import { OrganizationModel, IOrganizationDoc } from "../models/Organization.model";

export class OrganizationRepository {
  async create(data: Partial<IOrganizationDoc>): Promise<IOrganizationDoc> {
    const doc = new OrganizationModel(data);
    return doc.save();
  }

  async findByOrganizationId(organizationId: string): Promise<IOrganizationDoc | null> {
    return OrganizationModel.findOne({ organizationId }).exec();
  }

  async find(limit = 50): Promise<IOrganizationDoc[]> {
    return OrganizationModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return OrganizationModel.countDocuments().exec();
  }
}

export const organizationRepository = new OrganizationRepository();
