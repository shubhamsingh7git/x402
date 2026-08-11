import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    logger.warn(
      { requestId: req.requestId, statusCode: err.statusCode, path: req.path },
      err.message
    );

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
    return;
  }

  // Unexpected errors
  logger.error({ requestId: req.requestId, err, path: req.path }, "Unhandled error");

  res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : err.message,
  });
};

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
