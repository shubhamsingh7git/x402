import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityIncidentDoc extends Document {
  incidentId: string;
  title: string;
  severity: string;
  status: string;
  affectedResources: string[];
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const SecurityIncidentSchema = new Schema<ISecurityIncidentDoc>(
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
      default: "HIGH",
    },
    status: {
      type: String,
      default: "OPEN",
    },
    affectedResources: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SecurityIncidentModel = mongoose.model<ISecurityIncidentDoc>("SecurityIncident", SecurityIncidentSchema);
