import { apiServiceRepository } from "../../repositories/apiService.repository";
import { logger } from "../../utils/logger";

export interface ServiceDescriptor {
  serviceId: string;
  serviceName: string;
  endpoint: string;
  merchantId: string;
  network: string;
  price: number;
  enabled: boolean;
  version: string;
}

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private memoryRegistry = new Map<string, ServiceDescriptor>();

  private constructor() {
    this.seedDefaultDescriptors();
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private seedDefaultDescriptors(): void {
    const defaults: ServiceDescriptor[] = [
      {
        serviceId: "svc_search",
        serviceName: "Web Search Intelligence",
        endpoint: "https://api.search.x402.io/v1/query",
        merchantId: "OpenAI API",
        network: "Base Sepolia Testnet",
        price: 0.01,
        enabled: true,
        version: "1.0",
      },
      {
        serviceId: "svc_financial",
        serviceName: "Financial & Market Metrics",
        endpoint: "https://api.finance.x402.io/v1/metrics",
        merchantId: "Market Data API",
        network: "Base Sepolia Testnet",
        price: 0.02,
        enabled: true,
        version: "1.0",
      },
      {
        serviceId: "svc_summary",
        serviceName: "LLM Report Synthesis",
        endpoint: "https://api.summary.x402.io/v1/report",
        merchantId: "Research API",
        network: "Base Sepolia Testnet",
        price: 0.01,
        enabled: true,
        version: "1.0",
      },
    ];

    defaults.forEach((s) => this.memoryRegistry.set(s.serviceId, s));
  }

  public registerService(service: ServiceDescriptor): void {
    this.memoryRegistry.set(service.serviceId, service);
    logger.info(`🌐 Registered service in ServiceRegistry: ${service.serviceName} (${service.serviceId})`);
  }

  public async getService(serviceId: string): Promise<ServiceDescriptor | null> {
    if (this.memoryRegistry.has(serviceId)) {
      return this.memoryRegistry.get(serviceId)!;
    }

    const dbService = await apiServiceRepository.findById(serviceId);
    if (dbService) {
      return {
        serviceId: dbService._id.toString(),
        serviceName: dbService.serviceName,
        endpoint: dbService.endpoint,
        merchantId: dbService.merchant,
        network: dbService.network,
        price: dbService.price,
        enabled: dbService.enabled,
        version: "1.0",
      };
    }

    return null;
  }

  public async getServiceByMerchant(merchantId: string): Promise<ServiceDescriptor | null> {
    for (const service of this.memoryRegistry.values()) {
      if (service.merchantId === merchantId && service.enabled) {
        return service;
      }
    }
    return null;
  }

  public async resolvePrice(serviceId: string, defaultPrice = 0.01): Promise<number> {
    const service = await this.getService(serviceId);
    return service ? service.price : defaultPrice;
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();
