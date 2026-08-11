import mongoose, { Schema, Document } from "mongoose";

export interface IKnowledgeNodeDoc extends Document {
  nodeId: string;
  nodeType: string;
  label: string;
  properties: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeNodeSchema = new Schema<IKnowledgeNodeDoc>(
  {
    nodeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    nodeType: {
      type: String,
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
    },
    properties: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

KnowledgeNodeSchema.index({ label: "text" });

export const KnowledgeNodeModel = mongoose.model<IKnowledgeNodeDoc>("KnowledgeNode", KnowledgeNodeSchema);
