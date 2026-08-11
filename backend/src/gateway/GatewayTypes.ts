import { ServiceHealthEnum } from "./GatewayStatus";
import { RoutingAlgorithmEnum, GatewayPolicyScopeEnum } from "./GatewayPolicies";

export interface IServiceRegistryDTO {
  id?: string;
  serviceId: string;
  serviceName: string;
  targetUrl: string;
  version: string;
  status: ServiceHealthEnum;
  latencyMs: number;
  lastHealthCheck?: string | Date;
  weight: number;
  createdAt?: string | Date;
}

export interface IRouteDefinitionDTO {
  id?: string;
  routeId: string;
  pathPattern: string;
  targetServiceId: string;
  apiVersion: string;
  methods: string[];
  enabled: boolean;
  rateLimitPerMin: number;
  authRequired: boolean;
  createdAt?: string | Date;
}

export interface IGatewayPolicyDTO {
  id?: string;
  policyId: string;
  scope: GatewayPolicyScopeEnum;
  targetId?: string;
  rateLimitPerMin: number;
  burstLimit: number;
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  createdAt?: string | Date;
}

export interface IGatewayAnalyticsDTO {
  registeredServices: number;
  healthyServices: number;
  requestsPerMinute: number;
  averageLatencyMs: number;
  failedRequests: number;
  rateLimitedRequests: number;
  activeConnections: number;
  gatewayUptime: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
}
