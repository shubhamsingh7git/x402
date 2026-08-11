import { logger } from "../../../utils/logger";

export type ProtocolState =
  | "REQUEST_CREATED"
  | "REQUEST_SENT"
  | "CHALLENGE_RECEIVED"
  | "AUTHORIZATION_GENERATED"
  | "REQUEST_RETRY"
  | "RESPONSE_RECEIVED"
  | "RECEIPT_PARSED"
  | "NEGOTIATION_COMPLETED"
  | "NEGOTIATION_FAILED";

const VALID_PROTOCOL_TRANSITIONS: Record<ProtocolState, ProtocolState[]> = {
  REQUEST_CREATED: ["REQUEST_SENT", "NEGOTIATION_FAILED"],
  REQUEST_SENT: ["CHALLENGE_RECEIVED", "RESPONSE_RECEIVED", "NEGOTIATION_FAILED"],
  CHALLENGE_RECEIVED: ["AUTHORIZATION_GENERATED", "NEGOTIATION_FAILED"],
  AUTHORIZATION_GENERATED: ["REQUEST_RETRY", "NEGOTIATION_FAILED"],
  REQUEST_RETRY: ["RESPONSE_RECEIVED", "NEGOTIATION_FAILED"],
  RESPONSE_RECEIVED: ["RECEIPT_PARSED", "NEGOTIATION_FAILED"],
  RECEIPT_PARSED: ["NEGOTIATION_COMPLETED", "NEGOTIATION_FAILED"],
  NEGOTIATION_COMPLETED: [],
  NEGOTIATION_FAILED: [],
};

export class ProtocolStateMachine {
  public static transition(currentState: ProtocolState, targetState: ProtocolState, sessionId: string): ProtocolState {
    const allowed = VALID_PROTOCOL_TRANSITIONS[currentState] || [];
    if (!allowed.includes(targetState)) {
      logger.warn(`Illegal protocol state transition from ${currentState} to ${targetState} [Session: ${sessionId}]`);
    }

    logger.debug(`🔄 Protocol State Transition [${currentState} ➔ ${targetState}]`);
    return targetState;
  }
}
