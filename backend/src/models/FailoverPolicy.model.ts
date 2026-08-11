import mongoose, { Schema, Document } from "mongoose";

export interface IFailoverPolicyDoc extends Document {
  policyId: string;
  name: string;
  primaryRegion: string;
  secondaryRegion: string;
  mode: string;
  autoFailoverEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FailoverPolicySchema = new Schema<IFailoverPolicyDoc>(
  {
    policyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    primaryRegion: {
      type: String,
      required: true,
    },
    secondaryRegion: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: "ACTIVE_ACTIVE",
    },
    autoFailoverEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FailoverPolicyModel = mongoose.model<IFailoverPolicyDoc>("FailoverPolicy", FailoverPolicySchema);
