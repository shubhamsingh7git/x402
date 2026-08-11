import { TraceModel, ITraceDoc } from "../models/Trace.model";

export class TraceRepository {
  async create(data: Partial<ITraceDoc>): Promise<ITraceDoc> {
    const doc = new TraceModel(data);
    return doc.save();
  }

  async findByTraceId(traceId: string): Promise<ITraceDoc | null> {
    return TraceModel.findOne({ traceId }).exec();
  }

  async find(limit = 50): Promise<ITraceDoc[]> {
    return TraceModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return TraceModel.countDocuments().exec();
  }
}

export const traceRepository = new TraceRepository();
