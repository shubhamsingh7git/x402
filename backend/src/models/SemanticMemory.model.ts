import mongoose, { Schema, Document } from "mongoose";

export interface ISemanticMemoryDoc extends Document {
  memoryId: string;
  memoryType: string;
  title: string;
  content: string;
  confidenceScore: number;
  memoryVersion: number;
  sourceDomain: string;
  visibility: string;
  expirationDate?: Date;
  tags: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const SemanticMemorySchema = new Schema<ISemanticMemoryDoc>(
  {
    memoryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    memoryType: {
      type: String,
      default: "SEMANTIC",
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      default: 0.90,
    },
    memoryVersion: {
      type: Number,
      default: 1,
    },
    sourceDomain: {
      type: String,
      default: "PLATFORM_INTELLIGENCE",
    },
    visibility: {
      type: String,
      default: "PUBLIC",
    },
    expirationDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

SemanticMemorySchema.index({ title: "text", content: "text" });

export const SemanticMemoryModel = mongoose.model<ISemanticMemoryDoc>("SemanticMemory", SemanticMemorySchema);
