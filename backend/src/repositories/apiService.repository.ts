import { ApiService, IApiServiceDocument } from "../models/ApiService";

export class ApiServiceRepository {
  async create(data: Partial<IApiServiceDocument>): Promise<IApiServiceDocument> {
    return ApiService.create(data);
  }

  async findAll(): Promise<IApiServiceDocument[]> {
    return ApiService.find({ enabled: true });
  }

  async findById(id: string): Promise<IApiServiceDocument | null> {
    return ApiService.findById(id);
  }

  async updateById(id: string, data: Partial<IApiServiceDocument>): Promise<IApiServiceDocument | null> {
    return ApiService.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<IApiServiceDocument | null> {
    return ApiService.findByIdAndDelete(id);
  }
}

export const apiServiceRepository = new ApiServiceRepository();
