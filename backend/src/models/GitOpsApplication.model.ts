import mongoose, { Schema, Document } from "mongoose";

export interface IGitOpsApplicationDoc extends Document {
  appId: string;
  appName: string;
  repoUrl: string;
  path: string;
  targetRevision: string;
  syncStatus: string;
  healthStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const GitOpsApplicationSchema = new Schema<IGitOpsApplicationDoc>(
  {
    appId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    appName: {
      type: String,
      required: true,
    },
    repoUrl: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: "k8s/overlays/production",
    },
    targetRevision: {
      type: String,
      default: "HEAD",
    },
    syncStatus: {
      type: String,
      default: "SYNCHRONIZED",
    },
    healthStatus: {
      type: String,
      default: "HEALTHY",
    },
  },
  {
    timestamps: true,
  }
);

export const GitOpsApplicationModel = mongoose.model<IGitOpsApplicationDoc>("GitOpsApplication", GitOpsApplicationSchema);
