import mongoose, { Schema, Document } from "mongoose";
import { SessionStatusEnum } from "../security/SecurityStatus";

export interface ISessionDoc extends Document {
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: SessionStatusEnum;
  isMfaVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISessionDoc>(
  {
    sessionId: {
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
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatusEnum),
      default: SessionStatusEnum.ACTIVE,
      index: true,
    },
    isMfaVerified: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model<ISessionDoc>("Session", SessionSchema);
