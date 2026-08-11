import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      ApiResponse.created(res, "User registered successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      ApiResponse.ok(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.ok(res, "Current user", { user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
