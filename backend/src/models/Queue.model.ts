import mongoose, { Schema, Document } from "mongoose";

export interface IQueueDoc extends Document {
  queueName: string;
  category: string;
  pendingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  maxDepth: number;
  createdAt: Date;
  updatedAt: Date;
}

const QueueSchema = new Schema<IQueueDoc>(
  {
    queueName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    pendingJobs: {
      type: Number,
      default: 0,
    },
    runningJobs: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    failedJobs: {
      type: Number,
      default: 0,
    },
    maxDepth: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export const QueueModel = mongoose.model<IQueueDoc>("Queue", QueueSchema);
