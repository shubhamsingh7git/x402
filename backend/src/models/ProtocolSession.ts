import mongoose, { Schema, Document } from "mongoose";

export interface IProtocolSessionDocument extends Document {
  paymentId: string;
  executionId: string;
  runId: string;
  stepId?: number;
  serviceId?: string;
  protocolVersion: string;
  providerName: string;
  negotiationState: string;
  walletAddress?: string;
  signatureType?: string;
  authorizationPayload?: Record<string, unknown>;
  negotiationDuration?: number;
  settlementDuration?: number;
  receiptVerificationTime?: number;
  requestHeaders: Record<string, string>;
  challenge?: Record<string, unknown>;
  authorization?: Record<string, unknown>;
  receipt?: Record<string, unknown>;
  retryCount: number;
  durationMs: number;
  startedAt: Date;
  completedAt?: Date;
  status: "PENDING" | "NEGOTIATING" | "AUTHORIZED" | "COMPLETED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

const ProtocolSessionSchema = new Schema<IProtocolSessionDocument>(
  {
    paymentId: { type: String, required: true, index: true },
    executionId: { type: String, required: true, index: true },
    runId: { type: String, required: true, index: true },
    stepId: { type: Number },
    serviceId: { type: String },
    protocolVersion: { type: String, default: "1.0" },
    providerName: { type: String, default: "RealX402PaymentProvider" },
    negotiationState: { type: String, default: "REQUEST_CREATED" },
    walletAddress: { type: String },
    signatureType: { type: String, default: "ED25519" },
    authorizationPayload: { type: Schema.Types.Mixed },
    negotiationDuration: { type: Number, default: 0 },
    settlementDuration: { type: Number, default: 0 },
    receiptVerificationTime: { type: Number, default: 0 },
    requestHeaders: { type: Schema.Types.Mixed, default: {} },
    challenge: { type: Schema.Types.Mixed },
    authorization: { type: Schema.Types.Mixed },
    receipt: { type: Schema.Types.Mixed },
    retryCount: { type: Number, default: 0 },
    durationMs: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "NEGOTIATING", "AUTHORIZED", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const ProtocolSession = mongoose.model<IProtocolSessionDocument>(
  "ProtocolSession",
  ProtocolSessionSchema
);
