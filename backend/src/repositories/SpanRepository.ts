import { SpanModel, ISpanDoc } from "../models/Span.model";

export class SpanRepository {
  async create(data: Partial<ISpanDoc>): Promise<ISpanDoc> {
    const doc = new SpanModel(data);
    return doc.save();
  }

  async findByTraceId(traceId: string): Promise<ISpanDoc[]> {
    return SpanModel.find({ traceId }).sort({ createdAt: 1 }).exec();
  }
}

export const spanRepository = new SpanRepository();
