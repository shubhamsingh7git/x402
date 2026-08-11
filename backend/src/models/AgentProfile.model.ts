import mongoose, { Schema, Document } from "mongoose";
import { AgentStatusEnum } from "../agents/AgentStatus";

export interface IAgentProfileDoc extends Document {
  agentId: string;
  agentName: string;
  role: string;
  capabilities: string[];
  confidenceScore: number;
  costPerCallUsd: number;
  averageLatencyMs: number;
  status: AgentStatusEnum;
  systemPrompt?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AgentProfileSchema = new Schema<IAgentProfileDoc>(
  {
    agentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      index: true,
    },
    capabilities: {
      type: [String],
      default: [],
      index: true,
    },
    confidenceScore: {
      type: Number,
      default: 0.90,
    },
    costPerCallUsd: {
      type: Number,
      default: 0.01,
    },
    averageLatencyMs: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: Object.values(AgentStatusEnum),
      default: AgentStatusEnum.IDLE,
      index: true,
    },
    systemPrompt: {
      type: String,
    },
    permissions: {
      type: [String],
      default: ["EXECUTE_CAPABILITY"],
    },
  },
  {
    timestamps: true,
  }
);

export const AgentProfileModel = mongoose.model<IAgentProfileDoc>("AgentProfile", AgentProfileSchema);
