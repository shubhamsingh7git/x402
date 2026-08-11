import mongoose, { Schema, Document } from "mongoose";
import { AlertSeverityEnum } from "../observability/AlertSeverity";

export interface IAlertRuleDoc extends Document {
  ruleId: string;
  ruleName: string;
  targetMetric: string;
  threshold: number;
  severity: AlertSeverityEnum;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertRuleSchema = new Schema<IAlertRuleDoc>(
  {
    ruleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ruleName: {
      type: String,
      required: true,
    },
    targetMetric: {
      type: String,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    severity: {
      type: String,
      enum: Object.values(AlertSeverityEnum),
      default: AlertSeverityEnum.MEDIUM,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AlertRuleModel = mongoose.model<IAlertRuleDoc>("AlertRule", AlertRuleSchema);
