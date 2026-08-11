import { OptimizationRecommendationModel, IOptimizationRecommendationDoc } from "../models/OptimizationRecommendation.model";

export class OptimizationRepository {
  async create(data: Partial<IOptimizationRecommendationDoc>): Promise<IOptimizationRecommendationDoc> {
    const doc = new OptimizationRecommendationModel(data);
    return doc.save();
  }

  async findByRecommendationId(recommendationId: string): Promise<IOptimizationRecommendationDoc | null> {
    return OptimizationRecommendationModel.findOne({ recommendationId }).exec();
  }

  async updateStatus(recommendationId: string, status: "APPLIED" | "ARCHIVED"): Promise<IOptimizationRecommendationDoc | null> {
    return OptimizationRecommendationModel.findOneAndUpdate({ recommendationId }, { $set: { status } }, { new: true }).exec();
  }

  async find(limit = 50): Promise<IOptimizationRecommendationDoc[]> {
    return OptimizationRecommendationModel.find({}).sort({ impactScore: -1, createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return OptimizationRecommendationModel.countDocuments().exec();
  }
}

export const optimizationRepository = new OptimizationRepository();
