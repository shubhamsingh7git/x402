import { Request, Response, NextFunction } from "express";
import { plannerService } from "../planner/PlannerService";
import { ApiResponse } from "../utils/ApiResponse";
import { PLANNER_CONFIG } from "../planner/PlannerConfig";

export class PlannerController {
  async analyzeAndPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        ApiResponse.error(res, 400, "Research prompt is required and must be a non-empty string");
        return;
      }

      if (prompt.length > PLANNER_CONFIG.maxPromptLength) {
        ApiResponse.error(
          res,
          400,
          `Prompt length exceeds maximum allowed limit of ${PLANNER_CONFIG.maxPromptLength} characters`
        );
        return;
      }

      const meta = {
        userId: req.user?.userId,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get("user-agent"),
      };

      const result = await plannerService.analyzeAndPlan(prompt, meta);
      ApiResponse.ok(res, "Planner capability extraction and provider discovery completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const plannerController = new PlannerController();
