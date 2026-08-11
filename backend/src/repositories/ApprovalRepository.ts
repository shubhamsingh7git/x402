import { ApprovalRequestModel, IApprovalRequestDoc } from "../models/ApprovalRequest.model";

export class ApprovalRepository {
  async create(data: Partial<IApprovalRequestDoc>): Promise<IApprovalRequestDoc> {
    const doc = new ApprovalRequestModel(data);
    return doc.save();
  }

  async findByApprovalId(approvalId: string): Promise<IApprovalRequestDoc | null> {
    return ApprovalRequestModel.findOne({ approvalId }).exec();
  }

  async updateStatus(approvalId: string, status: "APPROVED" | "REJECTED" | "EXPIRED", decisionBy?: string): Promise<IApprovalRequestDoc | null> {
    return ApprovalRequestModel.findOneAndUpdate({ approvalId }, { $set: { status, decisionBy } }, { new: true }).exec();
  }

  async findPending(): Promise<IApprovalRequestDoc[]> {
    return ApprovalRequestModel.find({ status: "WAITING_APPROVAL" }).sort({ createdAt: -1 }).exec();
  }

  async find(limit = 50): Promise<IApprovalRequestDoc[]> {
    return ApprovalRequestModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }
}

export const approvalRepository = new ApprovalRepository();
