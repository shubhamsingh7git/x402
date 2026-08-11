import mongoose, { Schema, Document } from "mongoose";
import { PolicyEffectEnum } from "../security/SecurityStatus";

export interface IAuthorizationPolicyDoc extends Document {
  policyId: string;
  policyName: string;
  subjectRole: string;
  resource: string;
  action: string;
  effect: PolicyEffectEnum;
  conditions: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorizationPolicySchema = new Schema<IAuthorizationPolicyDoc>(
  {
    policyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    policyName: {
      type: String,
      required: true,
    },
    subjectRole: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    effect: {
      type: String,
      enum: Object.values(PolicyEffectEnum),
      default: PolicyEffectEnum.PERMIT,
    },
    conditions: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const AuthorizationPolicyModel = mongoose.model<IAuthorizationPolicyDoc>("AuthorizationPolicy", AuthorizationPolicySchema);
