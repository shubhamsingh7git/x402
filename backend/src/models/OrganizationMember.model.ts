import mongoose, { Schema, Document } from "mongoose";

export interface IOrganizationMemberDoc extends Document {
  memberId: string;
  userId: string;
  organizationId: string;
  workspaceId?: string;
  roles: string[];
  status: "ACTIVE" | "SUSPENDED";
  joinedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMemberDoc>(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
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
    roles: {
      type: [String],
      default: ["MEMBER"],
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const OrganizationMemberModel = mongoose.model<IOrganizationMemberDoc>("OrganizationMember", OrganizationMemberSchema);
