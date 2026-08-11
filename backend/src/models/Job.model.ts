import mongoose, { Schema, Document } from "mongoose";
import { JobStatusEnum } from "../distributed/JobStatus";

export interface IJobDoc extends Document {
  jobId: string;
  queueName: string;
  category: string;
  payload: Schema.Types.Mixed;
  priority: number;
  status: JobStatusEnum;
  correlationId?: string;
  idempotencyKey?: string;
  assignedWorkerId?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJobDoc>(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    queueName: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: Number,
      default: 5,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatusEnum),
      default: JobStatusEnum.QUEUED,
      index: true,
    },
    correlationId: {
      type: String,
      index: true,
    },
    idempotencyKey: {
      type: String,
      index: true,
    },
    assignedWorkerId: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    errorMessage: {
      type: String,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const JobModel = mongoose.model<IJobDoc>("Job", JobSchema);
