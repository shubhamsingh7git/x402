import { ProjectModel, IProjectDoc } from "../models/Project.model";

export class ProjectRepository {
  async create(data: Partial<IProjectDoc>): Promise<IProjectDoc> {
    const doc = new ProjectModel(data);
    return doc.save();
  }

  async findByProjectId(projectId: string): Promise<IProjectDoc | null> {
    return ProjectModel.findOne({ projectId }).exec();
  }

  async findByWorkspaceId(workspaceId: string): Promise<IProjectDoc[]> {
    return ProjectModel.find({ workspaceId }).sort({ createdAt: -1 }).exec();
  }

  async find(limit = 50): Promise<IProjectDoc[]> {
    return ProjectModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async count(): Promise<number> {
    return ProjectModel.countDocuments().exec();
  }
}

export const projectRepository = new ProjectRepository();
