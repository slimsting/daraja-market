import apiClient from "@/lib/api-client";
import { authLogger, logZodError } from "@/lib/loggers";
import {
  LoginCredentials,
  RegisterData,
  User,
  authResponseSchema,
  userSchema,
} from "@/types";
import { ZodError } from "zod";

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      const validated = authResponseSchema.safeParse(response.data);

      if (!validated.success) {
        logZodError(authLogger, "login", validated.error, response.data);
        throw new Error("Invalid login response");
      }

      if (!validated.data.data) {
        authLogger.error(
          { response: response.data },
          "No user in login response",
        );
        throw new Error("No user data in response");
      }

      authLogger.info(
        { email: credentials.email },
        "User logged in successfully",
      );
      return validated.data.data;
    } catch (error) {
      if (error instanceof ZodError) {
        logZodError(authLogger, "login", error);
      } else {
        authLogger.error({ error }, "Login failed");
      }
      throw error;
    }
  },

  // Register
  async register(data: RegisterData): Promise<void> {
    try {
      const response = await apiClient.post("/auth/register", data);
      const validated = authResponseSchema.safeParse(response.data);

      if (!validated.success) {
        logZodError(authLogger, "register", validated.error, response.data);
        throw new Error("Invalid register response");
      }

      authLogger.info({ email: data.email }, "User registered successfully");
    } catch (error) {
      if (error instanceof ZodError) {
        logZodError(authLogger, "register", error);
      } else {
        authLogger.error({ error }, "Registration failed");
      }
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get("/auth/me");
      const userData =
        response.data.user || response.data.data || response.data;

      const parsed = userSchema.safeParse(userData);

      if (!parsed.success) {
        logZodError(authLogger, "getCurrentUser", parsed.error, userData);
        throw new Error("User validation failed");
      }

      authLogger.debug({ id: parsed.data._id }, "Current user fetched");
      return parsed.data;
    } catch (error) {
      if (error instanceof ZodError) {
        logZodError(authLogger, "getCurrentUser", error);
      } else {
        authLogger.debug({ error }, "Failed to get current user");
      }
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
      authLogger.info("User logged out successfully");
    } catch (error) {
      authLogger.error({ error }, "Logout failed");
      throw error;
    }
  },
};
