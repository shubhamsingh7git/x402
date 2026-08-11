import mongoose, { Schema, Document } from "mongoose";

export interface IReleaseDoc extends Document {
  releaseId: string;
  version: string;
  title: string;
  status: string;
  approvedBy?: string;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReleaseSchema = new Schema<IReleaseDoc>(
  {
    releaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    version: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "APPROVED",
    },
    approvedBy: {
      type: String,
      default: "release-governance-board@enterprise.iam",
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ReleaseModel = mongoose.model<IReleaseDoc>("Release", ReleaseSchema);
