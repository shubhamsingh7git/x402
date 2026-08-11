import mongoose, { Schema, Document } from "mongoose";

export interface IApprovalRequestDoc extends Document {
  approvalId: string;
  sessionId: string;
  capability: string;
  riskScore: number;
  reason: string;
  requestedByAgentId: string;
  status: "WAITING_APPROVAL" | "APPROVED" | "REJECTED" | "EXPIRED";
  decisionBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalRequestSchema = new Schema<IApprovalRequestDoc>(
  {
    approvalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    capability: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      default: 75,
    },
    reason: {
      type: String,
      required: true,
    },
    requestedByAgentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["WAITING_APPROVAL", "APPROVED", "REJECTED", "EXPIRED"],
      default: "WAITING_APPROVAL",
      index: true,
    },
    decisionBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ApprovalRequestModel = mongoose.model<IApprovalRequestDoc>("ApprovalRequest", ApprovalRequestSchema);
