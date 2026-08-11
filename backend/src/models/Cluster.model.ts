import mongoose, { Schema, Document } from "mongoose";
import { ClusterStatusEnum } from "../devops/ClusterStatus";

export interface IClusterDoc extends Document {
  clusterId: string;
  name: string;
  region: string;
  provider: string;
  kubernetesVersion: string;
  nodeCount: number;
  status: ClusterStatusEnum;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClusterSchema = new Schema<IClusterDoc>(
  {
    clusterId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: "GKE",
    },
    kubernetesVersion: {
      type: String,
      default: "v1.30.2",
    },
    nodeCount: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: Object.values(ClusterStatusEnum),
      default: ClusterStatusEnum.HEALTHY,
      index: true,
    },
    cpuUsagePercent: {
      type: Number,
      default: 24.5,
    },
    memoryUsagePercent: {
      type: Number,
      default: 42.0,
    },
  },
  {
    timestamps: true,
  }
);

export const ClusterModel = mongoose.model<IClusterDoc>("Cluster", ClusterSchema);
