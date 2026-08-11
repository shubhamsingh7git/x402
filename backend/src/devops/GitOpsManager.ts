import { gitOpsRepository } from "../repositories/GitOpsRepository";

export class GitOpsManager {
  async getApplications() {
    return gitOpsRepository.find(50);
  }
}

export const gitOpsManager = new GitOpsManager();
