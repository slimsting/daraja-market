// src/services/auth.service.ts
import apiClient from "@/lib/api-client";
import {
  LoginCredentials,
  RegisterData,
  User,
  authResponseSchema,
  userSchema,
} from "@/types";

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post("/auth/login", credentials);
    const validated = authResponseSchema.parse(response.data);

    if (!validated.user) {
      throw new Error("No user data in response");
    }

    return validated.user;
  },

  // Register
  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post("/auth/register", data);
    const validated = authResponseSchema.parse(response.data);

    if (!validated.user) {
      throw new Error("No user data in response");
    }

    return validated.user;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return userSchema.parse(response.data.user || response.data);
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
