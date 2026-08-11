import { ServiceRegistryModel, IServiceRegistryDoc } from "../models/ServiceRegistry.model";

export class ServiceRegistryRepository {
  async upsert(data: Partial<IServiceRegistryDoc>): Promise<IServiceRegistryDoc> {
    return ServiceRegistryModel.findOneAndUpdate(
      { serviceId: data.serviceId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IServiceRegistryDoc>;
  }

  async findByServiceId(serviceId: string): Promise<IServiceRegistryDoc | null> {
    return ServiceRegistryModel.findOne({ serviceId }).exec();
  }

  async find(limit = 50): Promise<IServiceRegistryDoc[]> {
    return ServiceRegistryModel.find({}).sort({ serviceName: 1 }).limit(limit).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return ServiceRegistryModel.countDocuments(filter).exec();
  }
}

export const serviceRegistryRepository = new ServiceRegistryRepository();
