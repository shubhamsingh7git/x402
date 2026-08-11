import { approvalRepository } from "../repositories/ApprovalRepository";
import { auditLogRepository } from "../repositories/auditLog.repository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class ApprovalService {
  async createApprovalRequest(sessionId: string, capability: string, riskScore: number, reason: string, requestedByAgentId: string) {
    const approvalId = `appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const request = await approvalRepository.create({
      approvalId,
      sessionId,
      capability,
      riskScore,
      reason,
      requestedByAgentId,
      status: "WAITING_APPROVAL",
    });

    logger.info(`🚨 ApprovalService created approval request [${approvalId}] for capability '${capability}'`);
    eventBus.emitEvent("approval:requested" as any, request as any);
    return request;
  }

  async processApprovalAction(approvalId: string, action: "APPROVE" | "REJECT", userId = "usr_admin") {
    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    const request = await approvalRepository.updateStatus(approvalId, status, userId);

    if (!request) throw new Error(`Approval request '${approvalId}' not found`);

    await auditLogRepository.create({
      action: action === "APPROVE" ? ("APPROVAL_APPROVED" as any) : ("APPROVAL_REJECTED" as any),
      user: userId as any,
      ip: "127.0.0.1",
      userAgent: "ApprovalService/1.0",
      metadata: { approvalId, sessionId: request.sessionId, capability: request.capability },
    });

    const eventName = action === "APPROVE" ? "approval:approved" : "approval:rejected";
    eventBus.emitEvent(eventName as any, request as any);
    return request;
  }

  async getPendingApprovals() {
    return approvalRepository.findPending();
  }

  async getAllApprovals(limit = 50) {
    return approvalRepository.find(limit);
  }
}

export const approvalService = new ApprovalService();
