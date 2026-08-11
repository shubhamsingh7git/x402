import { ThreatEventModel, IThreatEventDoc } from "../models/ThreatEvent.model";

export class ThreatRepository {
  async save(data: Partial<IThreatEventDoc>): Promise<IThreatEventDoc> {
    const doc = new ThreatEventModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IThreatEventDoc[]> {
    return ThreatEventModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return ThreatEventModel.countDocuments(filter).exec();
  }
}

export const threatRepository = new ThreatRepository();
