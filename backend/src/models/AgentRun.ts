import mongoose, { Schema, Document } from "mongoose";
import { AGENT_STATUS } from "../constants/status";

export interface IAgentStepDocument {
  id: number;
  title?: string;
  type: string;
  status: string;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  estimatedCost?: number;
  actualCost?: number;
  cost?: number;
  retryCount?: number;
}

export interface IAgentRunDocument extends Document {
  query: string;
  status: string;
  plannerModel: string;
  executionVersion: string;
  totalCost: number;
  estimatedCost: number;
  actualCost: number;
  totalDuration: number;
  duration: number;
  steps: IAgentStepDocument[];
  userId?: mongoose.Types.ObjectId;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const agentStepSchema = new Schema<IAgentStepDocument>(
  {
    id: { type: Number, required: true },
    title: { type: String },
    type: { type: String, required: true },
    status: {
      type: String,
      default: AGENT_STATUS.QUEUED,
    },
    input: { type: Schema.Types.Mixed },
    output: { type: Schema.Types.Mixed },
    error: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
    duration: { type: Number, default: 0 },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    retryCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const agentRunSchema = new Schema<IAgentRunDocument>(
  {
    query: {
      type: String,
      required: [true, "Query is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(AGENT_STATUS),
      default: AGENT_STATUS.QUEUED,
    },
    plannerModel: {
      type: String,
      default: "gemini-2.5-flash",
    },
    executionVersion: {
      type: String,
      default: "1.0",
    },
    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    steps: [agentStepSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

agentRunSchema.index({ status: 1, createdAt: -1 });

export const AgentRun = mongoose.model<IAgentRunDocument>("AgentRun", agentRunSchema);
