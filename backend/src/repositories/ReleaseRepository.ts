import { ReleaseModel, IReleaseDoc } from "../models/Release.model";
import { OperationalRunbookModel, IOperationalRunbookDoc } from "../models/OperationalRunbook.model";

export class ReleaseRepository {
  async saveRelease(data: Partial<IReleaseDoc>): Promise<IReleaseDoc> {
    return ReleaseModel.findOneAndUpdate(
      { releaseId: data.releaseId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IReleaseDoc>;
  }

  async findReleases(): Promise<IReleaseDoc[]> {
    return ReleaseModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async saveRunbook(data: Partial<IOperationalRunbookDoc>): Promise<IOperationalRunbookDoc> {
    return OperationalRunbookModel.findOneAndUpdate(
      { runbookId: data.runbookId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IOperationalRunbookDoc>;
  }

  async findRunbooks(): Promise<IOperationalRunbookDoc[]> {
    return OperationalRunbookModel.find({}).sort({ title: 1 }).exec();
  }

  async countReleases(): Promise<number> {
    return ReleaseModel.countDocuments().exec();
  }

  async countRunbooks(): Promise<number> {
    return OperationalRunbookModel.countDocuments().exec();
  }
}

export const releaseRepository = new ReleaseRepository();
