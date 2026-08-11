import { IX402Client } from "../interfaces/x402.interface";
import { PaymentContext } from "../../dto/paymentContext";
import { PaymentResultDTO } from "../../dto/paymentResult.dto";
import { httpTransport, HttpTransport } from "../transport/HttpTransport";
import { challengeParser, ChallengeParser } from "../challenge/ChallengeParser";
import { authorizationBuilder, AuthorizationBuilder } from "../headers/AuthorizationBuilder";
import { receiptParser, ReceiptParser } from "../receipts/ReceiptParser";
import { ProtocolStateMachine, ProtocolState } from "../state/protocolState.machine";
import { protocolSessionRepository } from "../../../repositories/protocolSession.repository";
import { eventBus } from "../../../events/eventBus";
import { timelineService } from "../../../services/timeline/timeline.service";
import { auditService } from "../../../services/audit/audit.service";
import { logger } from "../../../utils/logger";

export class X402Client implements IX402Client {
  private transport: HttpTransport;
  private cParser: ChallengeParser;
  private aBuilder: AuthorizationBuilder;
  private rParser: ReceiptParser;

  constructor(
    transport = httpTransport,
    cParser = challengeParser,
    aBuilder = authorizationBuilder,
    rParser = receiptParser
  ) {
    this.transport = transport;
    this.cParser = cParser;
    this.aBuilder = aBuilder;
    this.rParser = rParser;
  }

  async executeProtocol(context: PaymentContext): Promise<PaymentResultDTO> {
    const startTime = Date.now();
    const endpoint = context.endpoint || `https://api.search.x402.io/v1/query`;

    // 1. Create ProtocolSession in MongoDB
    const session = await protocolSessionRepository.create({
      paymentId: context.paymentId,
      executionId: context.executionId,
      runId: context.runId,
      stepId: context.stepId,
      serviceId: context.serviceId,
      protocolVersion: "1.0",
      providerName: "X402PaymentProvider",
      negotiationState: "REQUEST_CREATED",
      requestHeaders: { url: endpoint, method: "POST" },
      startedAt: new Date(),
      status: "NEGOTIATING",
    });

    let currentState: ProtocolState = "REQUEST_CREATED";
    let retryCount = 0;

    try {
      // 2. State: REQUEST_SENT
      currentState = ProtocolStateMachine.transition(currentState, "REQUEST_SENT", session._id.toString());
      if (context.runId) {
        await timelineService.recordEvent(context.runId, "HTTP_REQUEST" as any, context.stepId, { endpoint });
      }

      let response;
      try {
        response = await this.transport.request({ method: "POST", url: endpoint });
      } catch (err: any) {
        if (err.statusCode === 402) {
          // HTTP 402 Challenge detected!
          currentState = ProtocolStateMachine.transition(currentState, "CHALLENGE_RECEIVED", session._id.toString());

          const challengeHeaders = err.responseHeaders || { "x-402-challenge": "v1.0" };
          const challenge = this.cParser.parseChallenge(challengeHeaders, err.responseBody);

          eventBus.emitEvent("x402:challenge" as any, { context, challenge, sessionId: session._id });
          if (context.runId) {
            await timelineService.recordEvent(context.runId, "HTTP_402_RECEIVED" as any, context.stepId, { challenge });
          }

          // Generate Authorization
          currentState = ProtocolStateMachine.transition(currentState, "AUTHORIZATION_GENERATED", session._id.toString());
          const auth = await this.aBuilder.buildAuthorization(challenge, context);

          eventBus.emitEvent("x402:authorized" as any, { context, auth, sessionId: session._id });
          if (context.runId) {
            await timelineService.recordEvent(context.runId, "AUTHORIZATION_CREATED" as any, context.stepId, { token: auth.token });
          }

          // Retry request with Authorization header
          currentState = ProtocolStateMachine.transition(currentState, "REQUEST_RETRY", session._id.toString());
          retryCount++;
          eventBus.emitEvent("x402:retry" as any, { context, attempt: retryCount });

          response = await this.transport.request({
            method: "POST",
            url: endpoint,
            headers: auth.headers,
          });

          // Response received
          currentState = ProtocolStateMachine.transition(currentState, "RESPONSE_RECEIVED", session._id.toString());

          // Parse receipt
          currentState = ProtocolStateMachine.transition(currentState, "RECEIPT_PARSED", session._id.toString());
          const receipt = this.rParser.parseReceipt(response.headers, response.data, context);

          currentState = ProtocolStateMachine.transition(currentState, "NEGOTIATION_COMPLETED", session._id.toString());

          const durationMs = Date.now() - startTime;

          // Update MongoDB ProtocolSession
          await protocolSessionRepository.updateById(session._id.toString(), {
            negotiationState: currentState,
            challenge: challenge as any,
            authorization: auth as any,
            receipt: receipt as any,
            retryCount,
            durationMs,
            completedAt: new Date(),
            status: "COMPLETED",
          });

          await auditService.createLog(
            "PAYMENT_COMPLETED",
            {
              protocol: "x402",
              paymentId: context.paymentId,
              durationMs,
              receiptId: receipt.receiptId,
            },
            undefined,
            context.correlationId
          );

          eventBus.emitEvent("x402:negotiationCompleted" as any, { context, receipt, durationMs });
          if (context.runId) {
            await timelineService.recordEvent(context.runId, "RECEIPT_PARSED" as any, context.stepId, { receiptId: receipt.receiptId });
          }

          return {
            success: true,
            paymentId: context.paymentId,
            correlationId: context.correlationId,
            status: "SETTLED",
            amount: context.amount,
            currency: context.currency,
            transactionId: receipt.transactionHash,
            receipt,
            latencyMs: durationMs,
            metadata: {
              ...context.metadata,
              protocolVersion: "1.0",
              sessionId: session._id.toString(),
            },
          };
        } else {
          throw err;
        }
      }

      // If initial request succeeded without 402 (direct response)
      currentState = ProtocolStateMachine.transition(currentState, "RESPONSE_RECEIVED", session._id.toString());
      currentState = ProtocolStateMachine.transition(currentState, "RECEIPT_PARSED", session._id.toString());
      const receipt = this.rParser.parseReceipt(response.headers, response.data, context);
      currentState = ProtocolStateMachine.transition(currentState, "NEGOTIATION_COMPLETED", session._id.toString());

      const durationMs = Date.now() - startTime;

      await protocolSessionRepository.updateById(session._id.toString(), {
        negotiationState: currentState,
        receipt: receipt as any,
        durationMs,
        completedAt: new Date(),
        status: "COMPLETED",
      });

      return {
        success: true,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "SETTLED",
        amount: context.amount,
        currency: context.currency,
        transactionId: receipt.transactionHash,
        receipt,
        latencyMs: durationMs,
        metadata: { ...context.metadata, sessionId: session._id.toString() },
      };
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      await protocolSessionRepository.updateById(session._id.toString(), {
        negotiationState: "NEGOTIATION_FAILED",
        durationMs,
        completedAt: new Date(),
        status: "FAILED",
      });

      eventBus.emitEvent("x402:error" as any, { context, error: error.message });
      logger.error({ err: error, paymentId: context.paymentId }, "x402 Protocol Client negotiation failed");

      return {
        success: false,
        paymentId: context.paymentId,
        correlationId: context.correlationId,
        status: "FAILED",
        amount: context.amount,
        currency: context.currency,
        latencyMs: durationMs,
        metadata: context.metadata,
        error: error.message || "x402 Protocol negotiation failed",
      };
    }
  }
}

export const x402Client = new X402Client();
