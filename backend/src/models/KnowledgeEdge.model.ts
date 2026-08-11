import mongoose, { Schema, Document } from "mongoose";

export interface IKnowledgeEdgeDoc extends Document {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  weight: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeEdgeSchema = new Schema<IKnowledgeEdgeDoc>(
  {
    edgeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sourceNodeId: {
      type: String,
      required: true,
      index: true,
    },
    targetNodeId: {
      type: String,
      required: true,
      index: true,
    },
    relationshipType: {
      type: String,
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      default: 1.0,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

KnowledgeEdgeSchema.index({ sourceNodeId: 1, targetNodeId: 1 });

export const KnowledgeEdgeModel = mongoose.model<IKnowledgeEdgeDoc>("KnowledgeEdge", KnowledgeEdgeSchema);
