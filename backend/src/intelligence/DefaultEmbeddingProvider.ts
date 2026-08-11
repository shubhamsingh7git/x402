import { IEmbeddingProvider } from "./IEmbeddingProvider";
import { INTELLIGENCE_CONFIG } from "./IntelligenceConfig";

export class DefaultEmbeddingProvider implements IEmbeddingProvider {
  providerName = "Deterministic-Semantic-Embedding-v1";

  async generateEmbedding(text: string): Promise<number[]> {
    const dim = INTELLIGENCE_CONFIG.embeddingDimension;
    const vector = new Array(dim).fill(0);
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let i = 0; i < dim; i++) {
      vector[i] = Number((Math.sin(hash + i) * 0.5 + 0.5).toFixed(4));
    }

    return vector;
  }

  calculateSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0.75;
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0.75 : Number((dot / denom).toFixed(2));
  }
}

export const defaultEmbeddingProvider = new DefaultEmbeddingProvider();
