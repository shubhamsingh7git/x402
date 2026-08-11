import mongoose, { Schema, Document } from "mongoose";
import { ExecutionStateEnum } from "../execution/ExecutionState";

export interface IExecutionSession extends Document {
  sessionId: string;
  runId?: string;
  planId?: string;
  capability: string;
  strategy: string;
  state: ExecutionStateEnum;
  success: boolean;
  finalProviderId?: string;
  finalMerchantAlias?: string;
  output?: Schema.Types.Mixed;
  attempts: any[];
  fallbackTriggered: boolean;
  fallbackCount: number;
  consensus?: Schema.Types.Mixed;
  totalCostUsd: number;
  totalDurationMs: number;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionSessionSchema = new Schema<IExecutionSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    runId: {
      type: String,
      index: true,
    },
    planId: {
      type: String,
      index: true,
    },
    capability: {
      type: String,
      required: true,
      index: true,
    },
    strategy: {
      type: String,
      default: "BALANCED",
      index: true,
    },
    state: {
      type: String,
      enum: Object.values(ExecutionStateEnum),
      default: ExecutionStateEnum.CREATED,
      index: true,
    },
    success: {
      type: Boolean,
      default: false,
      index: true,
    },
    finalProviderId: {
      type: String,
    },
    finalMerchantAlias: {
      type: String,
    },
    output: {
      type: Schema.Types.Mixed,
    },
    attempts: {
      type: [Object],
      default: [],
    },
    fallbackTriggered: {
      type: Boolean,
      default: false,
    },
    fallbackCount: {
      type: Number,
      default: 0,
    },
    consensus: {
      type: Schema.Types.Mixed,
    },
    totalCostUsd: {
      type: Number,
      default: 0,
    },
    totalDurationMs: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

ExecutionSessionSchema.index({ createdAt: -1 });

export const ExecutionSession = mongoose.model<IExecutionSession>("ExecutionSession", ExecutionSessionSchema);
