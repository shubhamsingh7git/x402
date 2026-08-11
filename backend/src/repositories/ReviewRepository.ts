import { Review, IReview } from "../models/Review.model";

export class ReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    const doc = new Review(data);
    return doc.save();
  }

  async findByProviderId(providerId: string, limit = 50): Promise<IReview[]> {
    return Review.find({ providerId }).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async countByProviderId(providerId: string): Promise<number> {
    return Review.countDocuments({ providerId }).exec();
  }

  async getAverageRating(providerId: string): Promise<number> {
    const res = await Review.aggregate([
      { $match: { providerId } },
      { $group: { _id: "$providerId", avgRating: { $avg: "$rating" } } },
    ]);
    return res[0]?.avgRating || 4.8;
  }
}

export const reviewRepository = new ReviewRepository();
