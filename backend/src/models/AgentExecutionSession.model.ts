import mongoose, { Schema, Document } from "mongoose";

export interface IAgentExecutionSessionDoc extends Document {
  sessionId: string;
  prompt: string;
  taskGraph: any[];
  status: "CREATED" | "ORCHESTRATING" | "WAITING_APPROVAL" | "COMPLETED" | "FAILED";
  consensusResult?: Schema.Types.Mixed;
  totalCostUsd: number;
  totalDurationMs: number;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const AgentExecutionSessionSchema = new Schema<IAgentExecutionSessionDoc>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    taskGraph: {
      type: [Object],
      default: [],
    },
    status: {
      type: String,
      enum: ["CREATED", "ORCHESTRATING", "WAITING_APPROVAL", "COMPLETED", "FAILED"],
      default: "CREATED",
      index: true,
    },
    consensusResult: {
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
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const AgentExecutionSessionModel = mongoose.model<IAgentExecutionSessionDoc>("AgentExecutionSession", AgentExecutionSessionSchema);
