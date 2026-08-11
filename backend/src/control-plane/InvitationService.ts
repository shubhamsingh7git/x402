import { InvitationModel, IInvitationDoc } from "../models/Invitation.model";
import { OrganizationMemberModel } from "../models/OrganizationMember.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";
import crypto from "crypto";

export class InvitationRepository {
  async create(data: Partial<IInvitationDoc>): Promise<IInvitationDoc> {
    const doc = new InvitationModel(data);
    return doc.save();
  }

  async findByOrganizationId(organizationId: string): Promise<IInvitationDoc[]> {
    return InvitationModel.find({ organizationId }).sort({ createdAt: -1 }).exec();
  }

  async findByToken(token: string): Promise<IInvitationDoc | null> {
    return InvitationModel.findOne({ token }).exec();
  }

  async updateStatus(invitationId: string, status: "ACCEPTED" | "CANCELLED" | "EXPIRED"): Promise<IInvitationDoc | null> {
    return InvitationModel.findOneAndUpdate({ invitationId }, { $set: { status } }, { new: true }).exec();
  }

  async countPending(): Promise<number> {
    return InvitationModel.countDocuments({ status: "PENDING" }).exec();
  }
}

export const invitationRepository = new InvitationRepository();

export class InvitationService {
  async createInvitation(organizationId: string, email: string, role = "MEMBER") {
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await invitationRepository.create({
      invitationId,
      token,
      organizationId,
      email,
      role,
      status: "PENDING",
      expiresAt,
    });

    logger.info(`✉️ InvitationService created invitation [${invitationId}] for ${email}`);
    return invitation;
  }

  async getInvitationsByOrg(organizationId: string) {
    return invitationRepository.findByOrganizationId(organizationId);
  }

  async acceptInvitation(token: string, userId = "usr_new") {
    const invitation = await invitationRepository.findByToken(token);
    if (!invitation || invitation.status !== "PENDING") {
      throw new Error("Invalid or expired invitation token");
    }

    await invitationRepository.updateStatus(invitation.invitationId, "ACCEPTED");

    const memberId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const member = await OrganizationMemberModel.create({
      memberId,
      userId,
      organizationId: invitation.organizationId,
      roles: [invitation.role],
      status: "ACTIVE",
    });

    logger.info(`✅ InvitationService accepted invitation [${invitation.invitationId}] -> User ${userId}`);
    return member;
  }
}

export const invitationService = new InvitationService();
