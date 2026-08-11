import { SessionModel, ISessionDoc } from "../models/Session.model";
import { SessionStatusEnum } from "../security/SecurityStatus";

export class SessionRepository {
  async create(data: Partial<ISessionDoc>): Promise<ISessionDoc> {
    const doc = new SessionModel(data);
    return doc.save();
  }

  async findActiveSessions(): Promise<ISessionDoc[]> {
    return SessionModel.find({ status: SessionStatusEnum.ACTIVE }).sort({ createdAt: -1 }).exec();
  }

  async revoke(sessionId: string): Promise<ISessionDoc | null> {
    return SessionModel.findOneAndUpdate(
      { sessionId },
      { $set: { status: SessionStatusEnum.REVOKED } },
      { new: true }
    ).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return SessionModel.countDocuments(filter).exec();
  }
}

export const sessionRepository = new SessionRepository();
