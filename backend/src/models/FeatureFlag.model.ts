import mongoose, { Schema, Document } from "mongoose";

export interface IFeatureFlagDoc extends Document {
  flagId: string;
  name: string;
  key: string;
  enabled: boolean;
  targetScope: "GLOBAL" | "ORGANIZATION" | "WORKSPACE" | "PROJECT" | "ENVIRONMENT";
  targetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureFlagSchema = new Schema<IFeatureFlagDoc>(
  {
    flagId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    targetScope: {
      type: String,
      enum: ["GLOBAL", "ORGANIZATION", "WORKSPACE", "PROJECT", "ENVIRONMENT"],
      default: "GLOBAL",
      index: true,
    },
    targetId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const FeatureFlagModel = mongoose.model<IFeatureFlagDoc>("FeatureFlag", FeatureFlagSchema);
