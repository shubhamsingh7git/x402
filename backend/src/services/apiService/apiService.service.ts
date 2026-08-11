import { apiServiceRepository } from "../../repositories/apiService.repository";
import { ApiError } from "../../utils/ApiError";

export class ApiServiceService {
  async listServices(): Promise<any[]> {
    return apiServiceRepository.findAll();
  }

  async getServiceById(id: string) {
    const service = await apiServiceRepository.findById(id);
    if (!service) throw ApiError.notFound("API Service not found");
    return service;
  }

  async createService(data: any) {
    return apiServiceRepository.create(data);
  }

  async updateService(id: string, data: any) {
    const service = await apiServiceRepository.updateById(id, data);
    if (!service) throw ApiError.notFound("API Service not found");
    return service;
  }

  async toggleService(id: string, isEnabled: boolean) {
    const service = await apiServiceRepository.updateById(id, { enabled: isEnabled });
    if (!service) throw ApiError.notFound("API Service not found");
    return service;
  }

  async deleteService(id: string) {
    const service = await apiServiceRepository.deleteById(id);
    if (!service) throw ApiError.notFound("API Service not found");
    return service;
  }
}

export const apiServiceService = new ApiServiceService();
