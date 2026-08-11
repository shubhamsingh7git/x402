import mongoose, { Schema, Document } from "mongoose";

export interface ITeamDoc extends Document {
  teamId: string;
  organizationId: string;
  workspaceId?: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeamDoc>(
  {
    teamId: {
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
    workspaceId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const TeamModel = mongoose.model<ITeamDoc>("Team", TeamSchema);
