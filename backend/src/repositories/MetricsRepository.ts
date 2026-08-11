import { MetricModel, IMetricDoc } from "../models/Metric.model";

export class MetricsRepository {
  async save(data: Partial<IMetricDoc>): Promise<IMetricDoc> {
    const doc = new MetricModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IMetricDoc[]> {
    return MetricModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }
}

export const metricsRepository = new MetricsRepository();
