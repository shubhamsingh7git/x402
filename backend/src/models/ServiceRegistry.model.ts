import mongoose, { Schema, Document } from "mongoose";
import { ServiceHealthEnum } from "../gateway/GatewayStatus";

export interface IServiceRegistryDoc extends Document {
  serviceId: string;
  serviceName: string;
  targetUrl: string;
  version: string;
  status: ServiceHealthEnum;
  latencyMs: number;
  lastHealthCheck: Date;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRegistrySchema = new Schema<IServiceRegistryDoc>(
  {
    serviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
      index: true,
    },
    targetUrl: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      default: "v1",
    },
    status: {
      type: String,
      enum: Object.values(ServiceHealthEnum),
      default: ServiceHealthEnum.HEALTHY,
      index: true,
    },
    latencyMs: {
      type: Number,
      default: 15,
    },
    lastHealthCheck: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceRegistryModel = mongoose.model<IServiceRegistryDoc>("ServiceRegistry", ServiceRegistrySchema);
