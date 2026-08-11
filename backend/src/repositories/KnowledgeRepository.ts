import { KnowledgeNodeModel, IKnowledgeNodeDoc } from "../models/KnowledgeNode.model";
import { KnowledgeEdgeModel, IKnowledgeEdgeDoc } from "../models/KnowledgeEdge.model";

export class KnowledgeRepository {
  async upsertNode(data: Partial<IKnowledgeNodeDoc>): Promise<IKnowledgeNodeDoc> {
    return KnowledgeNodeModel.findOneAndUpdate(
      { nodeId: data.nodeId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IKnowledgeNodeDoc>;
  }

  async upsertEdge(data: Partial<IKnowledgeEdgeDoc>): Promise<IKnowledgeEdgeDoc> {
    return KnowledgeEdgeModel.findOneAndUpdate(
      { edgeId: data.edgeId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IKnowledgeEdgeDoc>;
  }

  async getAllNodes(limit = 100): Promise<IKnowledgeNodeDoc[]> {
    return KnowledgeNodeModel.find({}).limit(limit).exec();
  }

  async getAllEdges(limit = 100): Promise<IKnowledgeEdgeDoc[]> {
    return KnowledgeEdgeModel.find({}).limit(limit).exec();
  }

  async countNodes(): Promise<number> {
    return KnowledgeNodeModel.countDocuments().exec();
  }

  async countEdges(): Promise<number> {
    return KnowledgeEdgeModel.countDocuments().exec();
  }
}

export const knowledgeRepository = new KnowledgeRepository();
