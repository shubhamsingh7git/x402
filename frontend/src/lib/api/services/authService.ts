import { apiClient } from "../axios";
import { ApiResponse, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>("/auth/login", { email, password });
    return res.data.data;
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>("/auth/register", { name, email, password });
    return res.data.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};
