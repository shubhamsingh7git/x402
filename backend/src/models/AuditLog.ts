import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLogDocument extends Document {
  action: string;
  user?: mongoose.Types.ObjectId;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    requestId: {
      type: String,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ user: 1 });

export const AuditLog = mongoose.model<IAuditLogDocument>("AuditLog", auditLogSchema);
