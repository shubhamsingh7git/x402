import mongoose, { Schema, Document } from "mongoose";
import { PipelineStatusEnum } from "../devops/ClusterStatus";

export interface IPipelineDoc extends Document {
  pipelineId: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  lastRunStatus: PipelineStatusEnum;
  totalBuildsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineSchema = new Schema<IPipelineDoc>(
  {
    pipelineId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    repositoryUrl: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      default: "main",
    },
    lastRunStatus: {
      type: String,
      enum: Object.values(PipelineStatusEnum),
      default: PipelineStatusEnum.SUCCESS,
    },
    totalBuildsCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const PipelineModel = mongoose.model<IPipelineDoc>("Pipeline", PipelineSchema);
