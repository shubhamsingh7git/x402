import mongoose, { Schema, Document } from "mongoose";
import { WorkspaceStatusEnum } from "../control-plane/WorkspaceStatus";

export interface IWorkspaceDoc extends Document {
  workspaceId: string;
  organizationId: string;
  name: string;
  slug: string;
  status: WorkspaceStatusEnum;
  maxProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspaceDoc>(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(WorkspaceStatusEnum),
      default: WorkspaceStatusEnum.ACTIVE,
      index: true,
    },
    maxProjects: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkspaceModel = mongoose.model<IWorkspaceDoc>("Workspace", WorkspaceSchema);
