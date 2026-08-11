import mongoose, { Schema, Document } from "mongoose";

export interface ISpanDoc extends Document {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  serviceName: string;
  durationMs: number;
  tags: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const SpanSchema = new Schema<ISpanDoc>(
  {
    spanId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    traceId: {
      type: String,
      required: true,
      index: true,
    },
    parentSpanId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const SpanModel = mongoose.model<ISpanDoc>("Span", SpanSchema);
