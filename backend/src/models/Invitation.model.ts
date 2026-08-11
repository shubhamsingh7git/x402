import mongoose, { Schema, Document } from "mongoose";

export interface IInvitationDoc extends Document {
  invitationId: string;
  token: string;
  organizationId: string;
  email: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitationDoc>(
  {
    invitationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    token: {
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
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "MEMBER",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "EXPIRED", "CANCELLED"],
      default: "PENDING",
      index: true,
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

export const InvitationModel = mongoose.model<IInvitationDoc>("Invitation", InvitationSchema);
