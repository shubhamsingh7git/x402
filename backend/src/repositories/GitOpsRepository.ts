import { GitOpsApplicationModel, IGitOpsApplicationDoc } from "../models/GitOpsApplication.model";

export class GitOpsRepository {
  async save(data: Partial<IGitOpsApplicationDoc>): Promise<IGitOpsApplicationDoc> {
    return GitOpsApplicationModel.findOneAndUpdate(
      { appId: data.appId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IGitOpsApplicationDoc>;
  }

  async find(limit = 50): Promise<IGitOpsApplicationDoc[]> {
    return GitOpsApplicationModel.find({}).sort({ appName: 1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return GitOpsApplicationModel.countDocuments().exec();
  }
}

export const gitOpsRepository = new GitOpsRepository();
