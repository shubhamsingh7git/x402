import mongoose, { Schema, Document } from "mongoose";
import { AlertSeverityEnum } from "../observability/AlertSeverity";
import { IncidentStatusEnum } from "../observability/IncidentStatus";

export interface IIncidentDoc extends Document {
  incidentId: string;
  title: string;
  severity: AlertSeverityEnum;
  status: IncidentStatusEnum;
  affectedServices: string[];
  rootCause?: string;
  openedAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncidentDoc>(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: Object.values(AlertSeverityEnum),
      default: AlertSeverityEnum.HIGH,
    },
    status: {
      type: String,
      enum: Object.values(IncidentStatusEnum),
      default: IncidentStatusEnum.OPEN,
      index: true,
    },
    affectedServices: {
      type: [String],
      default: [],
    },
    rootCause: {
      type: String,
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const IncidentModel = mongoose.model<IIncidentDoc>("Incident", IncidentSchema);
