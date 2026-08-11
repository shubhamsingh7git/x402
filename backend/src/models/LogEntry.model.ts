import mongoose, { Schema, Document } from "mongoose";

export interface ILogEntryDoc extends Document {
  logId: string;
  level: string;
  message: string;
  serviceName: string;
  traceId?: string;
  correlationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LogEntrySchema = new Schema<ILogEntryDoc>(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    level: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      index: true,
    },
    traceId: {
      type: String,
      index: true,
    },
    correlationId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LogEntryModel = mongoose.model<ILogEntryDoc>("LogEntry", LogEntrySchema);
