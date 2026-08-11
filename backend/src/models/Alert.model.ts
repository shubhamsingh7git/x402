import mongoose, { Schema, Document } from "mongoose";
import { AlertSeverityEnum } from "../observability/AlertSeverity";

export interface IAlertDoc extends Document {
  alertId: string;
  ruleId?: string;
  title: string;
  severity: AlertSeverityEnum;
  status: string;
  serviceName: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlertDoc>(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ruleId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: Object.values(AlertSeverityEnum),
      default: AlertSeverityEnum.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AlertModel = mongoose.model<IAlertDoc>("Alert", AlertSchema);
