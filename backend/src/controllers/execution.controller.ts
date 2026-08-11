import { Request, Response, NextFunction } from "express";
import { executionService } from "../execution/ExecutionService";
import { ApiResponse } from "../utils/ApiResponse";

export class ExecutionController {
  private getMeta(req: Request) {
    return {
      userId: req.user?.userId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const history = await executionService.getExecutionHistory(limit);
      ApiResponse.ok(res, "Execution history retrieved successfully", history);
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await executionService.getTelemetryMetrics();
      ApiResponse.ok(res, "Execution engine telemetry retrieved successfully", metrics);
    } catch (error) {
      next(error);
    }
  }

  async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const session = await executionService.getSessionById(id);
      if (!session) {
        ApiResponse.error(res, 404, "Execution session not found");
        return;
      }
      ApiResponse.ok(res, "Execution session retrieved successfully", session);
    } catch (error) {
      next(error);
    }
  }

  async runTestExecution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { capability, strategy } = req.body;
      const meta = this.getMeta(req);
      const cap = capability || "financial-analysis";
      const result = await executionService.runExecution(cap, strategy || "BALANCED", meta);
      ApiResponse.ok(res, "Test multi-provider execution completed successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

export const executionController = new ExecutionController();
