import mongoose, { Schema, Document } from "mongoose";
import { OrganizationStatusEnum } from "../control-plane/OrganizationStatus";

export interface IOrganizationDoc extends Document {
  organizationId: string;
  name: string;
  slug: string;
  status: OrganizationStatusEnum;
  ownerId: string;
  maxWorkspaces: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganizationDoc>(
  {
    organizationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(OrganizationStatusEnum),
      default: OrganizationStatusEnum.ACTIVE,
      index: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    maxWorkspaces: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const OrganizationModel = mongoose.model<IOrganizationDoc>("Organization", OrganizationSchema);
