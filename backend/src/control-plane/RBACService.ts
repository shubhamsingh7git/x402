import { RoleModel, IRoleDoc } from "../models/Role.model";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class RoleRepository {
  async create(data: Partial<IRoleDoc>): Promise<IRoleDoc> {
    const doc = new RoleModel(data);
    return doc.save();
  }

  async find(limit = 50): Promise<IRoleDoc[]> {
    return RoleModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return RoleModel.countDocuments().exec();
  }
}

export const roleRepository = new RoleRepository();

export class RBACService {
  async createRole(data: { roleName: string; scope: string; permissions: string[]; isCustom?: boolean }) {
    const roleId = `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const role = await roleRepository.create({
      ...data,
      roleId,
      isCustom: data.isCustom ?? true,
    });

    logger.info(`🔑 RBACService created Role [${roleId}] (${data.roleName})`);
    eventBus.emitEvent("controlplane:roleUpdated" as any, role as any);
    return role;
  }

  async getRoles() {
    return roleRepository.find(50);
  }
}

export const rbacService = new RBACService();
