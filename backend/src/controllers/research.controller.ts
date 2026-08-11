import { Request, Response, NextFunction } from "express";
import { researchService } from "../services/research/research.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ResearchController {
  async startResearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      const userId = req.user?.userId;
      const result = await researchService.initiateResearch(query, userId);
      ApiResponse.ok(res, "Research pipeline initiated", result);
    } catch (error) {
      next(error);
    }
  }

  async generatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      const userId = req.user?.userId;
      const result = await researchService.generatePlan(query, userId);
      ApiResponse.ok(res, "Research plan generated", result);
    } catch (error) {
      next(error);
    }
  }

  async executePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { runId, plan } = req.body;
      const result = await researchService.executePlan(runId, plan);
      ApiResponse.ok(res, "Research plan executed", result);
    } catch (error) {
      next(error);
    }
  }

  async listRuns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runs = await researchService.listRuns();
      ApiResponse.ok(res, "Research runs retrieved", runs);
    } catch (error) {
      next(error);
    }
  }

  async getRunDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runId = req.params.runId as string;
      const details = await researchService.getRunDetails(runId);
      ApiResponse.ok(res, "Research run details retrieved", details);
    } catch (error) {
      next(error);
    }
  }

  async getRunTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runId = req.params.runId as string;
      const timeline = await researchService.getRunTimeline(runId);
      ApiResponse.ok(res, "Research run timeline retrieved", timeline);
    } catch (error) {
      next(error);
    }
  }

  async getRunResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runId = req.params.runId as string;
      const result = await researchService.getRunResult(runId);
      ApiResponse.ok(res, "Research run result retrieved", result);
    } catch (error) {
      next(error);
    }
  }
}

export const researchController = new ResearchController();
