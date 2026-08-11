import mongoose, { Schema, Document } from "mongoose";
import { GatewayPolicyScopeEnum } from "../gateway/GatewayPolicies";

export interface IGatewayPolicyDoc extends Document {
  policyId: string;
  scope: GatewayPolicyScopeEnum;
  targetId?: string;
  rateLimitPerMin: number;
  burstLimit: number;
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const GatewayPolicySchema = new Schema<IGatewayPolicyDoc>(
  {
    policyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    scope: {
      type: String,
      enum: Object.values(GatewayPolicyScopeEnum),
      default: GatewayPolicyScopeEnum.GLOBAL,
      index: true,
    },
    targetId: {
      type: String,
    },
    rateLimitPerMin: {
      type: Number,
      default: 120,
    },
    burstLimit: {
      type: Number,
      default: 200,
    },
    cacheEnabled: {
      type: Boolean,
      default: true,
    },
    cacheTtlSeconds: {
      type: Number,
      default: 300,
    },
  },
  {
    timestamps: true,
  }
);

export const GatewayPolicyModel = mongoose.model<IGatewayPolicyDoc>("GatewayPolicy", GatewayPolicySchema);
