import { BackupPolicyModel, IBackupPolicyDoc } from "../models/BackupPolicy.model";

export class BackupRepository {
  async save(data: Partial<IBackupPolicyDoc>): Promise<IBackupPolicyDoc> {
    const doc = new BackupPolicyModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IBackupPolicyDoc[]> {
    return BackupPolicyModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return BackupPolicyModel.countDocuments().exec();
  }
}

export const backupRepository = new BackupRepository();
