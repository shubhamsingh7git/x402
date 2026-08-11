import mongoose, { Schema, Document } from "mongoose";

export interface IOptimizationRecommendationDoc extends Document {
  recommendationId: string;
  category: string; // OPERATIONAL, COST, QUALITY, SECURITY, GOVERNANCE, MARKETPLACE
  title: string;
  description: string;
  targetEntityId: string;
  targetEntityType: string;
  impactScore: number;
  estimatedSavingsUsd?: number;
  status: "RECOMMENDING" | "WAITING_APPROVAL" | "APPLIED" | "ARCHIVED";
  proposedConfig: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const OptimizationRecommendationSchema = new Schema<IOptimizationRecommendationDoc>(
  {
    recommendationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetEntityId: {
      type: String,
      required: true,
    },
    targetEntityType: {
      type: String,
      required: true,
    },
    impactScore: {
      type: Number,
      default: 80,
    },
    estimatedSavingsUsd: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["RECOMMENDING", "WAITING_APPROVAL", "APPLIED", "ARCHIVED"],
      default: "RECOMMENDING",
      index: true,
    },
    proposedConfig: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const OptimizationRecommendationModel = mongoose.model<IOptimizationRecommendationDoc>("OptimizationRecommendation", OptimizationRecommendationSchema);
