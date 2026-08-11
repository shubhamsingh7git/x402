import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { userRepository } from "../../repositories/user.repository";
import { auditLogRepository } from "../../repositories/auditLog.repository";
import { eventBus } from "../../events/eventBus";
import { EVENTS } from "../../constants/events";
import { ApiError } from "../../utils/ApiError";
import { IAuthResponse, IJwtPayload } from "../../interfaces/auth.interface";
import { RegisterInput, LoginInput } from "../../validators/auth.validator";

const SALT_ROUNDS = 12;

export class AuthService {
  async register(data: RegisterInput): Promise<IAuthResponse> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = this.generateToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    // Audit log
    await auditLogRepository.create({
      action: "AUTH_REGISTER",
      user: user._id as any,
      metadata: { email: user.email, name: user.name },
    });
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "AUTH_REGISTER", userId: user._id });

    return { user: userWithoutPassword as IAuthResponse["user"], token };
  }

  async login(data: LoginInput): Promise<IAuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = this.generateToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    // Audit log
    await auditLogRepository.create({
      action: "AUTH_LOGIN",
      user: user._id as any,
      metadata: { email: user.email },
    });
    eventBus.emitEvent(EVENTS.AUDIT_LOG_CREATED, { action: "AUTH_LOGIN", userId: user._id });

    return { user: userWithoutPassword as IAuthResponse["user"], token };
  }

  private generateToken(payload: IJwtPayload): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
  }
}

export const authService = new AuthService();
