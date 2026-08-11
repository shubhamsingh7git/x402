import { logger } from "../utils/logger";

export class LockManager {
  private activeLocks: Map<string, { workerId: string; expiresAt: number }> = new Map();

  acquireLock(lockId: string, workerId: string, durationMs = 30000): boolean {
    const now = Date.now();
    const existing = this.activeLocks.get(lockId);

    if (existing && existing.expiresAt > now && existing.workerId !== workerId) {
      logger.warn(`🔒 LockManager: Lock [${lockId}] is held by Worker [${existing.workerId}]`);
      return false;
    }

    this.activeLocks.set(lockId, { workerId, expiresAt: now + durationMs });
    logger.debug(`🔑 LockManager: Lock [${lockId}] acquired by Worker [${workerId}]`);
    return true;
  }

  releaseLock(lockId: string, workerId: string): void {
    const existing = this.activeLocks.get(lockId);
    if (existing && existing.workerId === workerId) {
      this.activeLocks.delete(lockId);
      logger.debug(`🔓 LockManager: Lock [${lockId}] released by Worker [${workerId}]`);
    }
  }
}

export const lockManager = new LockManager();
