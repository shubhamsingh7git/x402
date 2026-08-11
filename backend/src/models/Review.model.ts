import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  reviewId: string;
  providerId: string;
  authorId: string;
  authorAlias: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    providerId: {
      type: String,
      required: true,
      index: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorAlias: {
      type: String,
      default: "Verified Client",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ providerId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
