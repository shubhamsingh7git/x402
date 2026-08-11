import mongoose, { Schema, Document } from "mongoose";

export interface IBackupPolicyDoc extends Document {
  backupId: string;
  name: string;
  targetCluster: string;
  snapshotSizeGb: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const BackupPolicySchema = new Schema<IBackupPolicyDoc>(
  {
    backupId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    targetCluster: {
      type: String,
      required: true,
    },
    snapshotSizeGb: {
      type: Number,
      default: 45,
    },
    status: {
      type: String,
      default: "COMPLETED",
    },
  },
  {
    timestamps: true,
  }
);

export const BackupPolicyModel = mongoose.model<IBackupPolicyDoc>("BackupPolicy", BackupPolicySchema);
