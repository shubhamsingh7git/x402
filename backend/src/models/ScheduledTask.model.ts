import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledTaskDoc extends Document {
  taskId: string;
  taskName: string;
  cronExpression: string;
  targetQueue: string;
  jobCategory: string;
  enabled: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledTaskSchema = new Schema<IScheduledTaskDoc>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    cronExpression: {
      type: String,
      required: true,
    },
    targetQueue: {
      type: String,
      default: "default",
    },
    jobCategory: {
      type: String,
      default: "MAINTENANCE",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    lastRunAt: {
      type: Date,
    },
    nextRunAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const ScheduledTaskModel = mongoose.model<IScheduledTaskDoc>("ScheduledTask", ScheduledTaskSchema);
