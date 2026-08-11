import mongoose, { Schema, Document } from "mongoose";

export interface IMetricDoc extends Document {
  metricName: string;
  metricType: string;
  value: number;
  serviceName: string;
  tags: Schema.Types.Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const MetricSchema = new Schema<IMetricDoc>(
  {
    metricName: {
      type: String,
      required: true,
      index: true,
    },
    metricType: {
      type: String,
      default: "GAUGE",
    },
    value: {
      type: Number,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      index: true,
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

export const MetricModel = mongoose.model<IMetricDoc>("Metric", MetricSchema);
