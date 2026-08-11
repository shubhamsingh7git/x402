import mongoose, { Schema, Document } from "mongoose";

export interface IAPIKeyDoc extends Document {
  keyId: string;
  organizationId: string;
  keyName: string;
  keyHash: string;
  maskedKey: string;
  scopes: string[];
  expiresAt?: Date;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  createdAt: Date;
  updatedAt: Date;
}

const APIKeySchema = new Schema<IAPIKeyDoc>(
  {
    keyId: {
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
    },
    keyHash: {
      type: String,
      required: true,
    },
    maskedKey: {
      type: String,
      required: true,
    },
    scopes: {
      type: [String],
      default: ["planner:read"],
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const APIKeyModel = mongoose.model<IAPIKeyDoc>("APIKey", APIKeySchema);
