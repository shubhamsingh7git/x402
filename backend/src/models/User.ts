import mongoose, { Schema, Document } from "mongoose";
import { ROLES, Role } from "../constants/roles";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    walletAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserDocument>("User", userSchema);
