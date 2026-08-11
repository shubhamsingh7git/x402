import { WorkspaceModel, IWorkspaceDoc } from "../models/Workspace.model";

export class WorkspaceRepository {
  async create(data: Partial<IWorkspaceDoc>): Promise<IWorkspaceDoc> {
    const doc = new WorkspaceModel(data);
    return doc.save();
  }

  async findByWorkspaceId(workspaceId: string): Promise<IWorkspaceDoc | null> {
    return WorkspaceModel.findOne({ workspaceId }).exec();
  }

  async findByOrganizationId(organizationId: string): Promise<IWorkspaceDoc[]> {
    return WorkspaceModel.find({ organizationId }).sort({ createdAt: -1 }).exec();
  }

  async find(limit = 50): Promise<IWorkspaceDoc[]> {
    return WorkspaceModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return WorkspaceModel.countDocuments().exec();
  }
}

export const workspaceRepository = new WorkspaceRepository();
