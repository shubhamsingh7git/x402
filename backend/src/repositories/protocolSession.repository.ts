import { ProtocolSession, IProtocolSessionDocument } from "../models/ProtocolSession";

export class ProtocolSessionRepository {
  async create(data: Partial<IProtocolSessionDocument>): Promise<IProtocolSessionDocument> {
    return ProtocolSession.create(data);
  }

  async findById(id: string): Promise<IProtocolSessionDocument | null> {
    return ProtocolSession.findById(id);
  }

  async findByPaymentId(paymentId: string): Promise<IProtocolSessionDocument | null> {
    return ProtocolSession.findOne({ paymentId });
  }

  async updateById(
    id: string,
    data: Partial<IProtocolSessionDocument>
  ): Promise<IProtocolSessionDocument | null> {
    return ProtocolSession.findByIdAndUpdate(id, data, { new: true });
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number
  ): Promise<{ data: IProtocolSessionDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      ProtocolSession.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProtocolSession.countDocuments(filter),
    ]);
    return { data, total };
  }
}

export const protocolSessionRepository = new ProtocolSessionRepository();
