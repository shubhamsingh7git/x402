import mongoose, { Schema, Document } from "mongoose";

export interface IMFADeviceDoc extends Document {
  deviceId: string;
  userId: string;
  deviceType: string;
  deviceName: string;
  isTrusted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MFADeviceSchema = new Schema<IMFADeviceDoc>(
  {
    deviceId: {
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
    deviceType: {
      type: String,
      default: "TOTP",
    },
    deviceName: {
      type: String,
      required: true,
    },
    isTrusted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MFADeviceModel = mongoose.model<IMFADeviceDoc>("MFADevice", MFADeviceSchema);
