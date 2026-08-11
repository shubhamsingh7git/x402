import mongoose, { Schema, Document } from "mongoose";

export interface ISecretDoc extends Document {
  secretId: string;
  organizationId: string;
  keyName: string;
  encryptedValue: string;
  version: number;
  status: "ACTIVE" | "PREVIOUS" | "PENDING_ROTATION";
  createdAt: Date;
  updatedAt: Date;
}

const SecretSchema = new Schema<ISecretDoc>(
  {
    secretId: {
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
    keyName: {
      type: String,
      required: true,
      index: true,
    },
    encryptedValue: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PREVIOUS", "PENDING_ROTATION"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SecretModel = mongoose.model<ISecretDoc>("Secret", SecretSchema);
