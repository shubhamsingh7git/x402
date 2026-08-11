import { PipelineModel, IPipelineDoc } from "../models/Pipeline.model";
import { ArtifactSignatureModel, IArtifactSignatureDoc } from "../models/ArtifactSignature.model";
import { SbomModel, ISbomDoc } from "../models/SBOM.model";

export class PipelineRepository {
  async savePipeline(data: Partial<IPipelineDoc>): Promise<IPipelineDoc> {
    return PipelineModel.findOneAndUpdate(
      { pipelineId: data.pipelineId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IPipelineDoc>;
  }

  async findPipelines(): Promise<IPipelineDoc[]> {
    return PipelineModel.find({}).sort({ name: 1 }).exec();
  }

  async saveSignature(data: Partial<IArtifactSignatureDoc>): Promise<IArtifactSignatureDoc> {
    const doc = new ArtifactSignatureModel(data);
    return doc.save();
  }

  async findSignatures(): Promise<IArtifactSignatureDoc[]> {
    return ArtifactSignatureModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async saveSbom(data: Partial<ISbomDoc>): Promise<ISbomDoc> {
    const doc = new SbomModel(data);
    return doc.save();
  }

  async findSboms(): Promise<ISbomDoc[]> {
    return SbomModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async countPipelines(): Promise<number> {
    return PipelineModel.countDocuments().exec();
  }

  async countSignatures(): Promise<number> {
    return ArtifactSignatureModel.countDocuments().exec();
  }

  async countSboms(): Promise<number> {
    return SbomModel.countDocuments().exec();
  }
}

export const pipelineRepository = new PipelineRepository();
