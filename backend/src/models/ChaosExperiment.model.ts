import mongoose, { Schema, Document } from "mongoose";
import { ChaosStatusEnum } from "../production/ProductionStatus";

export interface IChaosExperimentDoc extends Document {
  experimentId: string;
  title: string;
  faultType: string;
  targetService: string;
  resilienceScorePercent: number;
  status: ChaosStatusEnum;
  lastExecutedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChaosExperimentSchema = new Schema<IChaosExperimentDoc>(
  {
    experimentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    faultType: {
      type: String,
      default: "SERVICE_OUTAGE",
    },
    targetService: {
      type: String,
      required: true,
    },
    resilienceScorePercent: {
      type: Number,
      default: 98.5,
    },
    status: {
      type: String,
      enum: Object.values(ChaosStatusEnum),
      default: ChaosStatusEnum.PASSED,
    },
    lastExecutedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const ChaosExperimentModel = mongoose.model<IChaosExperimentDoc>("ChaosExperiment", ChaosExperimentSchema);
