import { IncidentModel, IIncidentDoc } from "../models/Incident.model";

export class IncidentRepository {
  async save(data: Partial<IIncidentDoc>): Promise<IIncidentDoc> {
    const doc = new IncidentModel(data);
    return doc.save();
  }

  async findByIncidentId(incidentId: string): Promise<IIncidentDoc | null> {
    return IncidentModel.findOne({ incidentId }).exec();
  }

  async updateStatus(incidentId: string, status: string, rootCause?: string): Promise<IIncidentDoc | null> {
    return IncidentModel.findOneAndUpdate(
      { incidentId },
      { $set: { status, rootCause, resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : undefined } },
      { new: true }
    ).exec();
  }

  async find(limit = 50): Promise<IIncidentDoc[]> {
    return IncidentModel.find({}).sort({ openedAt: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return IncidentModel.countDocuments(filter).exec();
  }
}

export const incidentRepository = new IncidentRepository();
