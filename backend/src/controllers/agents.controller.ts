import { Request, Response, NextFunction } from "express";
import { agentRegistry } from "../agents/AgentRegistry";
import { agentOrchestrator } from "../agents/AgentOrchestrator";
import { memoryManager } from "../agents/MemoryManager";
import { approvalService } from "../agents/ApprovalService";
import { governanceEngine } from "../agents/GovernanceEngine";
import { agentExecutionRepository } from "../repositories/AgentExecutionRepository";
import { ApiResponse } from "../utils/ApiResponse";

export class AgentsController {
  private getMeta(req: Request) {
    return {
      userId: req.user?.userId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };
  }

  async getRegistry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = await agentRegistry.getAllAgents();
      ApiResponse.ok(res, "Agent registry retrieved successfully", agents);
    } catch (error) {
      next(error);
    }
  }

  async registerAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agent = await agentRegistry.registerAgent(req.body);
      ApiResponse.created(res, "Agent registered successfully", agent);
    } catch (error) {
      next(error);
    }
  }

  async orchestrateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body;
      const meta = this.getMeta(req);
      if (!prompt) {
        ApiResponse.error(res, 400, "Missing required prompt for agent orchestration");
        return;
      }
      const session = await agentOrchestrator.orchestrateMultiAgentSession(prompt, meta);
      ApiResponse.ok(res, "Multi-agent session orchestration started", session);
    } catch (error) {
      next(error);
    }
  }

  async getExecutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const sessions = await agentExecutionRepository.find(limit);
      ApiResponse.ok(res, "Agent execution sessions retrieved successfully", sessions);
    } catch (error) {
      next(error);
    }
  }

  async getExecutionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const session = await agentExecutionRepository.findBySessionId(id);
      if (!session) {
        ApiResponse.error(res, 404, "Agent execution session not found");
        return;
      }
      ApiResponse.ok(res, "Agent execution session details retrieved successfully", session);
    } catch (error) {
      next(error);
    }
  }

  async getSessionMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId as string;
      const memory = await memoryManager.readSessionMemory(sessionId);
      ApiResponse.ok(res, "Shared agent memory retrieved successfully", memory);
    } catch (error) {
      next(error);
    }
  }

  async getApprovals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const approvals = await approvalService.getAllApprovals();
      ApiResponse.ok(res, "Human approval requests retrieved successfully", approvals);
    } catch (error) {
      next(error);
    }
  }

  async processApprovalAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { action } = req.body;
      const meta = this.getMeta(req);

      if (!action || !["APPROVE", "REJECT"].includes(action)) {
        ApiResponse.error(res, 400, "Action must be APPROVE or REJECT");
        return;
      }

      const request = await approvalService.processApprovalAction(id, action, meta.userId || "usr_admin");
      ApiResponse.ok(res, `Approval request ${action.toLowerCase()}d successfully`, request);
    } catch (error) {
      next(error);
    }
  }

  async evaluateGovernance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { capability, cost } = req.body;
      const result = governanceEngine.evaluateTaskGovernance(capability || "financial-analysis", cost || 0.02);
      ApiResponse.ok(res, "Governance evaluation completed successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

export const agentsController = new AgentsController();
