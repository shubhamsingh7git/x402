import { Response } from "express";

interface SuccessPayload<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: string[];
}

export class ApiResponse {
  static success<T>(res: Response, statusCode: number, message: string, data: T): Response {
    const payload: SuccessPayload<T> = { success: true, message, data };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.success(res, 201, message, data);
  }

  static ok<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.success(res, 200, message, data);
  }

  static error(res: Response, statusCode: number, message: string, errors?: string[]): Response {
    const payload: ErrorPayload = { success: false, message, errors };
    return res.status(statusCode).json(payload);
  }
}
