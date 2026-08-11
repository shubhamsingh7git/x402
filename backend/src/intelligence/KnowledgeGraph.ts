import { knowledgeRepository } from "../repositories/KnowledgeRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class KnowledgeGraph {
  async addNode(nodeId: string, nodeType: string, label: string, properties: Record<string, unknown> = {}) {
    const node = await knowledgeRepository.upsertNode({ nodeId, nodeType, label, properties: properties as any });
    logger.info(`🕸️ KnowledgeGraph added Node [${nodeId}] (${label})`);
    eventBus.emitEvent("intelligence:knowledgeUpdated" as any, node as any);
    return node;
  }

  async addEdge(sourceNodeId: string, targetNodeId: string, relationshipType: string, weight = 1.0) {
    const edgeId = `edge_${sourceNodeId}_${targetNodeId}_${relationshipType}`;
    const edge = await knowledgeRepository.upsertEdge({
      edgeId,
      sourceNodeId,
      targetNodeId,
      relationshipType,
      weight,
      version: 1,
    });
    logger.info(`🔗 KnowledgeGraph added Edge [${edgeId}] (${relationshipType})`);
    eventBus.emitEvent("intelligence:knowledgeUpdated" as any, edge as any);
    return edge;
  }

  async getGraphData(limit = 100) {
    const [nodes, edges] = await Promise.all([
      knowledgeRepository.getAllNodes(limit),
      knowledgeRepository.getAllEdges(limit),
    ]);
    return { nodes, edges };
  }
}

export const knowledgeGraph = new KnowledgeGraph();
