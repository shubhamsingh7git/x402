import mongoose, { Schema, Document } from "mongoose";

export interface ITraceDoc extends Document {
  traceId: string;
  rootSpanName: string;
  serviceName: string;
  status: string;
  durationMs: number;
  spansCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TraceSchema = new Schema<ITraceDoc>(
  {
    traceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rootSpanName: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      default: "OK",
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    spansCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const TraceModel = mongoose.model<ITraceDoc>("Trace", TraceSchema);
