import { ClusterModel, IClusterDoc } from "../models/Cluster.model";

export class ClusterRepository {
  async save(data: Partial<IClusterDoc>): Promise<IClusterDoc> {
    return ClusterModel.findOneAndUpdate(
      { clusterId: data.clusterId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IClusterDoc>;
  }

  async find(limit = 50): Promise<IClusterDoc[]> {
    return ClusterModel.find({}).sort({ name: 1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return ClusterModel.countDocuments(filter).exec();
  }
}

export const clusterRepository = new ClusterRepository();
