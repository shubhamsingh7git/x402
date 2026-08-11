import { Request, Response, NextFunction } from "express";
import { agentRunService } from "../services/agentRun/agentRun.service";
import { parseQueryParams } from "../utils/query.util";
import { ApiResponse } from "../utils/ApiResponse";

export class AgentRunController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = parseQueryParams(req, ["query", "status"]);
      const result = await agentRunService.getAgentRuns(params);
      ApiResponse.ok(res, "Agent runs retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const run = await agentRunService.getAgentRunById(id);
      ApiResponse.ok(res, "Agent run retrieved successfully", run);
    } catch (error) {
      next(error);
    }
  }
}

export const agentRunController = new AgentRunController();
