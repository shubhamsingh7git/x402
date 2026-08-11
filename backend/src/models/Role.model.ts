import mongoose, { Schema, Document } from "mongoose";

export interface IRoleDoc extends Document {
  roleId: string;
  roleName: string;
  scope: string;
  permissions: string[];
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRoleDoc>(
  {
    roleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      default: "ORGANIZATION",
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const RoleModel = mongoose.model<IRoleDoc>("Role", RoleSchema);
