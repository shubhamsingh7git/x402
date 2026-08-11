import mongoose, { Schema, Document } from "mongoose";
import { WorkerStatusEnum } from "../distributed/WorkerStatus";

export interface IWorkerDoc extends Document {
  workerId: string;
  workerType: string;
  assignedQueues: string[];
  status: WorkerStatusEnum;
  activeJobsCount: number;
  processedJobsCount: number;
  lastHeartbeat: Date;
  uptimeSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorkerDoc>(
  {
    workerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    workerType: {
      type: String,
      required: true,
    },
    assignedQueues: {
      type: [String],
      default: ["default"],
    },
    status: {
      type: String,
      enum: Object.values(WorkerStatusEnum),
      default: WorkerStatusEnum.IDLE,
      index: true,
    },
    activeJobsCount: {
      type: Number,
      default: 0,
    },
    processedJobsCount: {
      type: Number,
      default: 0,
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },
    uptimeSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkerModel = mongoose.model<IWorkerDoc>("Worker", WorkerSchema);
