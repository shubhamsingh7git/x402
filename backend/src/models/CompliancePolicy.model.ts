import mongoose, { Schema, Document } from "mongoose";

export interface ICompliancePolicyDoc extends Document {
  framework: string;
  ruleName: string;
  description: string;
  isMandatory: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompliancePolicySchema = new Schema<ICompliancePolicyDoc>(
  {
    framework: {
      type: String,
      required: true,
      index: true,
    },
    ruleName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isMandatory: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export const CompliancePolicyModel = mongoose.model<ICompliancePolicyDoc>("CompliancePolicy", CompliancePolicySchema);
