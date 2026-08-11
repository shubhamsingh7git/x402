export interface IEmbeddingProvider {
  providerName: string;
  generateEmbedding(text: string): Promise<number[]>;
  calculateSimilarity(vecA: number[], vecB: number[]): number;
}
