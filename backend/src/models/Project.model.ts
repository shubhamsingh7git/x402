import mongoose, { Schema, Document } from "mongoose";
import { ProjectStatusEnum } from "../control-plane/ProjectStatus";

export interface IProjectDoc extends Document {
  projectId: string;
  workspaceId: string;
  organizationId: string;
  name: string;
  status: ProjectStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    workspaceId: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: Object.values(ProjectStatusEnum),
      default: ProjectStatusEnum.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel = mongoose.model<IProjectDoc>("Project", ProjectSchema);
