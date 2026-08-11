import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export interface CorrelatedRequest extends Request {
  correlationId?: string;
  requestId?: string;
}

export const correlationMiddleware = (req: CorrelatedRequest, res: Response, next: NextFunction): void => {
  const correlationId = (req.headers["x-correlation-id"] as string) || `corr_${uuidv4().substring(0, 12)}`;
  const requestId = (req.headers["x-request-id"] as string) || `req_${uuidv4().substring(0, 12)}`;

  req.correlationId = correlationId;
  req.requestId = requestId;

  res.setHeader("x-correlation-id", correlationId);
  res.setHeader("x-request-id", requestId);

  next();
};
