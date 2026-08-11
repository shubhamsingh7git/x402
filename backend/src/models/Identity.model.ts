import mongoose, { Schema, Document } from "mongoose";

export interface IIdentityDoc extends Document {
  userId: string;
  email: string;
  role: string;
  isMfaEnabled: boolean;
  riskScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const IdentitySchema = new Schema<IIdentityDoc>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "USER",
    },
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const IdentityModel = mongoose.model<IIdentityDoc>("Identity", IdentitySchema);
