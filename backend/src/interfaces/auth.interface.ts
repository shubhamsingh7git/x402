import { Role } from "../constants/roles";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, "password">;
  token: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
}
