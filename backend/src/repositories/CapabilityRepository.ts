import { Capability, ICapability } from "../models/Capability.model";
import { FilterQuery } from "mongoose";

export class CapabilityRepository {
  async create(data: Partial<ICapability>): Promise<ICapability> {
    const doc = new Capability(data);
    return doc.save();
  }

  async findByName(name: string): Promise<ICapability | null> {
    return Capability.findOne({ name: name.toLowerCase() }).exec();
  }

  async find(filter: FilterQuery<ICapability> = {}, limit = 100): Promise<ICapability[]> {
    return Capability.find(filter).sort({ name: 1 }).limit(limit).exec();
  }

  async update(name: string, data: Partial<ICapability>): Promise<ICapability | null> {
    return Capability.findOneAndUpdate({ name: name.toLowerCase() }, { $set: data }, { new: true }).exec();
  }

  async count(filter: FilterQuery<ICapability> = {}): Promise<number> {
    return Capability.countDocuments(filter).exec();
  }
}

export const capabilityRepository = new CapabilityRepository();
