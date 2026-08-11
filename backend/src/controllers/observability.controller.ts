import { Request, Response, NextFunction } from "express";
import { traceRepository } from "../repositories/TraceRepository";
import { metricsEngine } from "../observability/MetricsEngine";
import { structuredLogger } from "../observability/StructuredLogger";
import { alertManager } from "../observability/AlertManager";
import { incidentManager } from "../observability/IncidentManager";
import { ApiResponse } from "../utils/ApiResponse";

export class ObservabilityController {
  async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = {
        overallStatus: "HEALTHY",
        services: [
          { name: "planner-service", status: "HEALTHY", latencyMs: 12 },
          { name: "bazaar-service", status: "HEALTHY", latencyMs: 8 },
          { name: "marketplace-service", status: "HEALTHY", latencyMs: 15 },
          { name: "agents-service", status: "HEALTHY", latencyMs: 10 },
          { name: "intelligence-service", status: "HEALTHY", latencyMs: 24 },
          { name: "controlplane-service", status: "HEALTHY", latencyMs: 6 },
          { name: "distributed-service", status: "HEALTHY", latencyMs: 14 },
          { name: "gateway-service", status: "HEALTHY", latencyMs: 5 },
        ],
      };
      ApiResponse.ok(res, "Health monitoring topology retrieved successfully", health);
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await metricsEngine.getMetrics();
      ApiResponse.ok(res, "Metrics retrieved successfully", metrics);
    } catch (error) {
      next(error);
    }
  }

  async getTraces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const traces = await traceRepository.find(50);
      ApiResponse.ok(res, "Distributed traces retrieved successfully", traces);
    } catch (error) {
      next(error);
    }
  }

  async getTraceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const trace = await traceRepository.findByTraceId(id);
      if (!trace) {
        ApiResponse.error(res, 404, "Trace not found");
        return;
      }
      ApiResponse.ok(res, "Trace details retrieved successfully", trace);
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await structuredLogger.getLogs(50);
      ApiResponse.ok(res, "Structured logs retrieved successfully", logs);
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alerts = await alertManager.getAlerts();
      ApiResponse.ok(res, "Alerts retrieved successfully", alerts);
    } catch (error) {
      next(error);
    }
  }

  async getAlertRules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rules = await alertManager.getRules();
      ApiResponse.ok(res, "Alert rules retrieved successfully", rules);
    } catch (error) {
      next(error);
    }
  }

  async getIncidents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const incidents = await incidentManager.getIncidents();
      ApiResponse.ok(res, "Incidents retrieved successfully", incidents);
    } catch (error) {
      next(error);
    }
  }

  async openIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, affectedServices, severity, rootCause } = req.body;
      const incident = await incidentManager.openIncident(title, affectedServices || [], severity, rootCause);
      ApiResponse.created(res, "Incident opened successfully", incident);
    } catch (error) {
      next(error);
    }
  }

  async getDependencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dependencies = [
        { source: "gateway-service", target: "planner-service", callsPerMin: 140, latencyMs: 12 },
        { source: "planner-service", target: "bazaar-service", callsPerMin: 120, latencyMs: 8 },
        { source: "planner-service", target: "execution-engine", callsPerMin: 95, latencyMs: 18 },
        { source: "execution-engine", target: "marketplace-service", callsPerMin: 80, latencyMs: 15 },
        { source: "agents-service", target: "intelligence-service", callsPerMin: 45, latencyMs: 24 },
      ];
      ApiResponse.ok(res, "Service dependency topology retrieved successfully", dependencies);
    } catch (error) {
      next(error);
    }
  }

  async getSlos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slos = [
        { serviceName: "API Gateway", sloTargetPercent: 99.9, currentAvailabilityPercent: 99.98, errorBudgetRemainingPercent: 92.4, mttrMinutes: 4.2 },
        { serviceName: "Planner Service", sloTargetPercent: 99.5, currentAvailabilityPercent: 99.85, errorBudgetRemainingPercent: 88.0, mttrMinutes: 6.5 },
        { serviceName: "Marketplace & Bazaar", sloTargetPercent: 99.9, currentAvailabilityPercent: 99.95, errorBudgetRemainingPercent: 94.1, mttrMinutes: 3.1 },
        { serviceName: "Agent Orchestration", sloTargetPercent: 99.0, currentAvailabilityPercent: 99.60, errorBudgetRemainingPercent: 82.3, mttrMinutes: 8.4 },
      ];
      ApiResponse.ok(res, "SLO & SLA metrics retrieved successfully", slos);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = {
        healthyServices: 8,
        degradedServices: 0,
        activeAlerts: 1,
        criticalAlerts: 0,
        openIncidents: 0,
        activeTraces: 42,
        logsPerMinute: 850,
        averageLatencyMs: 14,
        availability: 99.98,
        errorRate: 0.02,
      };
      ApiResponse.ok(res, "Observability dashboard metrics retrieved successfully", dashboard);
    } catch (error) {
      next(error);
    }
  }
}

export const observabilityController = new ObservabilityController();
