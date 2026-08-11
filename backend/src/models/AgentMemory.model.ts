import mongoose, { Schema, Document } from "mongoose";

export interface IAgentMemoryDoc extends Document {
  memoryId: string;
  sessionId: string;
  key: string;
  value: Schema.Types.Mixed;
  sourceAgentId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AgentMemorySchema = new Schema<IAgentMemoryDoc>(
  {
    memoryId: {
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
    key: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sourceAgentId: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const AgentMemoryModel = mongoose.model<IAgentMemoryDoc>("AgentMemory", AgentMemorySchema);
