import mongoose, { Schema, Document } from "mongoose";

export interface IAutoscalingPolicyDoc extends Document {
  policyId: string;
  deploymentName: string;
  minReplicas: number;
  maxReplicas: number;
  targetCpuPercent: number;
  targetMemoryPercent: number;
  currentReplicas: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutoscalingPolicySchema = new Schema<IAutoscalingPolicyDoc>(
  {
    policyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentName: {
      type: String,
      required: true,
    },
    minReplicas: {
      type: Number,
      default: 2,
    },
    maxReplicas: {
      type: Number,
      default: 10,
    },
    targetCpuPercent: {
      type: Number,
      default: 80,
    },
    targetMemoryPercent: {
      type: Number,
      default: 85,
    },
    currentReplicas: {
      type: Number,
      default: 3,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AutoscalingPolicyModel = mongoose.model<IAutoscalingPolicyDoc>("AutoscalingPolicy", AutoscalingPolicySchema);
