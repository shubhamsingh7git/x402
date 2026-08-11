import { sessionRepository } from "../repositories/SessionRepository";
import { eventBus } from "../events/eventBus";
import { logger } from "../utils/logger";

export class AuthenticationService {
  async revokeSession(sessionId: string) {
    const revoked = await sessionRepository.revoke(sessionId);
    if (revoked) {
      logger.info(`🔒 Session [${sessionId}] revoked cleanly`);
      eventBus.emitEvent("security:sessionRevoked" as any, { sessionId });
    }
    return revoked;
  }

  async getActiveSessions() {
    return sessionRepository.findActiveSessions();
  }
}

export const authenticationService = new AuthenticationService();
