import { SecurityIncidentModel, ISecurityIncidentDoc } from "../models/SecurityIncident.model";

export class SecurityIncidentRepository {
  async save(data: Partial<ISecurityIncidentDoc>): Promise<ISecurityIncidentDoc> {
    const doc = new SecurityIncidentModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<ISecurityIncidentDoc[]> {
    return SecurityIncidentModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return SecurityIncidentModel.countDocuments(filter).exec();
  }
}

export const securityIncidentRepository = new SecurityIncidentRepository();
