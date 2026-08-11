import mongoose, { Schema, Document } from "mongoose";
import { DeploymentStatusEnum } from "../devops/ClusterStatus";

export interface IDeploymentDoc extends Document {
  deploymentId: string;
  name: string;
  namespace: string;
  clusterId: string;
  imageTag: string;
  replicas: number;
  availableReplicas: number;
  strategy: string;
  status: DeploymentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const DeploymentSchema = new Schema<IDeploymentDoc>(
  {
    deploymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    namespace: {
      type: String,
      default: "default",
    },
    clusterId: {
      type: String,
      required: true,
      index: true,
    },
    imageTag: {
      type: String,
      required: true,
    },
    replicas: {
      type: Number,
      default: 3,
    },
    availableReplicas: {
      type: Number,
      default: 3,
    },
    strategy: {
      type: String,
      default: "CANARY",
    },
    status: {
      type: String,
      enum: Object.values(DeploymentStatusEnum),
      default: DeploymentStatusEnum.RUNNING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DeploymentModel = mongoose.model<IDeploymentDoc>("Deployment", DeploymentSchema);
