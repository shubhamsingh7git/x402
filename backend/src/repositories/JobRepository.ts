import { JobModel, IJobDoc } from "../models/Job.model";
import { FilterQuery } from "mongoose";

export class JobRepository {
  async create(data: Partial<IJobDoc>): Promise<IJobDoc> {
    const doc = new JobModel(data);
    return doc.save();
  }

  async findByJobId(jobId: string): Promise<IJobDoc | null> {
    return JobModel.findOne({ jobId }).exec();
  }

  async updateStatus(jobId: string, status: string, updates: Partial<IJobDoc> = {}): Promise<IJobDoc | null> {
    return JobModel.findOneAndUpdate({ jobId }, { $set: { status, ...updates } }, { new: true }).exec();
  }

  async find(filter: FilterQuery<IJobDoc> = {}, limit = 50): Promise<IJobDoc[]> {
    return JobModel.find(filter).sort({ priority: -1, createdAt: -1 }).limit(limit).exec();
  }

  async count(filter: FilterQuery<IJobDoc> = {}): Promise<number> {
    return JobModel.countDocuments(filter).exec();
  }
}

export const jobRepository = new JobRepository();
